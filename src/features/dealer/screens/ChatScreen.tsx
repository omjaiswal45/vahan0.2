import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { sendMessage } from '../services/dealerAPI';

const ChatScreen = ({ route }: any) => {
  const { leadId } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Fetch messages from API (replace with real API)
    setTimeout(() => {
      setMessages([{ sender: 'Customer', text: 'Hi, interested in your car' }]);
      setLoading(false);
    }, 500);
  }, [leadId]);

  const handleSend = async () => {
    if (!input) return;
    await sendMessage(leadId, input);
    setMessages([...messages, { sender: 'You', text: input }]);
    setInput('');
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={{ padding: 4, fontWeight: item.sender === 'You' ? 'bold' : 'normal' }}>
            {item.sender}: {item.text}
          </Text>
        )}
      />
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type a message"
        style={{ borderWidth: 1, padding: 8, marginVertical: 8, borderRadius: 5 }}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

export default ChatScreen;
