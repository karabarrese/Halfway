import pandas as pd
from transformers import BertTokenizer, BertForSequenceClassification
from wordcloud import WordCloud
import nltk
from nltk.corpus import stopwords
import matplotlib.pyplot as plt
import torch

# Download NLTK stopwords
nltk.download('stopwords')

# Load your dataset, assuming it has a column named 'text'
df = pd.read_csv('responses.csv')

# Sample data for demonstration
# data = {'text': ['This is a sample text.', 'Another example sentence.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', '']}
# df = pd.DataFrame(data)

# Drop rows with empty or non-string values in the 'text' column
df = df.dropna(subset=['text'])
df = df[df['text'].apply(lambda x: isinstance(x, str))]

# Define additional custom stopwords
custom_stopwords = ['find', 'today', 'week', 'day', 'feeling', 'struggled', 'joy', 'made', 'entire', 
                    'much', 'need', 'way', 'much', 'feel', 'top', 'moments', 'tomorrow', 'hi', 'fatigue']

# Combine NLTK stopwords with custom stopwords
stop_words = set(stopwords.words('english') + custom_stopwords)

# Check if there are any rows left in the DataFrame
if df.empty:
    print("No valid input data remaining.")
else:
    # Initialize BERT tokenizer and sentiment analysis model
    tokenizer = BertTokenizer.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')
    model = BertForSequenceClassification.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')

    # Tokenize each word separately and create input tensors for the model
    tokenized_texts = tokenizer(df['text'].tolist(), return_tensors='pt', padding=True, truncation=True)
    
    # Make predictions using the sentiment analysis model
    with torch.no_grad():
        output = model(**tokenized_texts)['logits'].softmax(dim=1).detach().numpy()

    # Threshold for classifying as positive or negative
    threshold = 0.4
    negative_words = [word for word, pred in zip(df['text'], output) if pred[1] > threshold]
    positive_words = [word for word, pred in zip(df['text'], output) if pred[1] <= threshold]

    print("Positive Words:", positive_words)
    print("Negative Words:", negative_words)

    # Combine positive and negative words into single strings for word clouds
    positive_text = ' '.join(positive_words)
    negative_text = ' '.join(negative_words)

    # Create word clouds for positive and negative words
    positive_wordcloud = WordCloud(width=800, height=400, background_color='white', colormap='CMRmap_r', max_words=30, stopwords=stop_words).generate(positive_text)
    negative_wordcloud = WordCloud(width=800, height=400, background_color='white', colormap='CMRmap_r', stopwords=stop_words).generate(negative_text)

    # Display the word clouds for positive and negative words
    plt.figure(figsize=(15, 6))

    plt.imshow(positive_wordcloud, interpolation='bilinear')
    plt.title('Positive Words', fontsize=20, fontweight='bold')  # Adjust fontsize and fontweight as needed
    plt.axis('off')
    plt.savefig("positive_wordcloud.png")
    plt.show()

    plt.figure(figsize=(15, 6))
    plt.imshow(negative_wordcloud, interpolation='bilinear')
    plt.title('Negative Words', fontsize=20, fontweight='bold')  # Adjust fontsize and fontweight as needed
    plt.axis('off')
    plt.savefig("negative_wordcloud.png")
    plt.show()

