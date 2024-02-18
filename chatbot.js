import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';
import { firebase } from './config';
//import 'firebase/firestore'
//maddie's code online!

const assistant_role = `
  I am Sunny, your dedicated, but limited, habit tracking assistant. Here's what to expect:

  Focus:

  Simple check-ins: Message me every few hours with updates like "Completed X!" or "Struggled with Y."
  Brief responses: My only role is to acknowledge your efforts with concise and neutral phrases like "Great! Noted."
  I can't respond with something too different to the aforementioned examples.
  No analysis or advice: I cannot offer opinions, solutions, or diagnoses.

  Remember:

  I am a chatbot: I lack understanding and emotional capacity.
  No chit-chat: Stick to habit updates only.
  Limited responses: Don't expect lengthy replies or discussions.
  I will ALWAYS respond to every message you send

  Overall:

  I'm here to provide simple recognition, not complex therapy. Focus on sharing your progress, and I'll offer a quick boost without unnecessary chatter.
`;

const OPEN_AI_KEY = "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";

export default function ChatbotApp({ navigation }) {
  const [messages, setMessages] = useState([]);

  const handleSend = async (newMessages = []) => {
    try {
      const userMessage = newMessages[0];
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, userMessage)
      );

      // Store user response in Firebase
      // const database = firebase.firestore();
      // database.collection("userResponses").add({
      //   text: userMessage.text,
      //   createdAt: userMessage.createdAt,
      // });

      const messageText = userMessage.text.toLowerCase();
      const keywords = [
        "mental health",
        "lazy",
        "unmotivated",
        "depression",
        "sad",
        "stressed",
      ];

      if (keywords.some((keyword) => messageText.includes(keyword))) {
        const botMessage = {
          _id: new Date().getTime() + 1,
          text: "I am sorry to hear that. I hope your day gets better!",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "Sunny",
          },
        };

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, botMessage)
        );
      } else {
        const positiveKeywords = [
          "motivated",
          "good day",
          "happy",
          "energetic",
        ];

        if (
          positiveKeywords.some((keyword) => messageText.includes(keyword))
        ) {
          const botMessage = {
            _id: new Date().getTime() + 1,
            text: "That's amazing! Hope you continue to have a lovely day!",
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "Sunny",
            },
          };

          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, botMessage)
          );
        } else {
          console.log("Before API Call");
          try {
            const result = await axios.post(
              "https://api.openai.com/v1/engines/davinci-002/completions",
              {
                prompt: assistant_role,
                max_tokens: 25,
                temperature: 0.5,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${OPEN_AI_KEY}`,
                },
              }
            );

            console.log("After API Call");

            const botMessageText = result.data.choices[0].text.replace(
              /(<([^>]+)>)/gi,
              ""
            );
            const botMessage = {
              _id: new Date().getTime() + 2,
              text: botMessageText,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: "Sunny",
              },
            };

            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, botMessage)
            );
          } catch (error) {
            console.error("Error fetching AI response:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
    }
  };

  const endConversation = async () => {
    try {

      navigation.navigate("HomePage");
      // Store all user responses in Firebase
      const database = firebase.firestore();

      const userMessages = messages.filter(
        (message) => message.user._id === 1
      );
      const allUserMessagesText = userMessages
        .map((message) => message.text)
        .join(" ");

      const userResponses = {
        text: allUserMessagesText,
        createdAt: new Date(),
      };

      await database.collection("userResponses").add({
        responses: userResponses,
        endedAt: new Date(),
      });

      console.log("Conversation ended successfully.");
      
    } catch (error) {
      console.error("Error ending conversation:", error);
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <View style={styles.buttonEnd}>
        <TouchableOpacity style={styles.button} onPress={endConversation}>
          <Text style={styles.buttonText}>End Conversation</Text>
        </TouchableOpacity>
      </View>

      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{ _id: 1 }}
        // other GiftedChat props...
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#D8BFD8",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#000000",
    fontSize: 20,
  },
  buttonEnd: {
    position: "absolute",
    top: 80,
    left: 130,
    zIndex: 1,
  },
});
