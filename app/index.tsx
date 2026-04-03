import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: "center", 
      alignItems: "center", 
      backgroundColor: '#378837' }}>
      <Text style={{ 
        fontSize: 35, 
        marginBottom: 50, 
        fontWeight: 'bold', 
        color: 'white' }}>
        Planteki
      </Text>

      {/* IMPORTANT: link goes to /login, not inside tabs */}
      <Link href="/createacc" asChild>
        <Pressable style={{ 
          width: 200, 
          height: 50, 
          backgroundColor: '#266e26', 
          borderRadius: 8, 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: 15}}>

          <Text style={{ 
            color: 'white', 
            fontSize: 16, 
            fontWeight: 'bold' }}>
            Create Account
          </Text>
        </Pressable>
      </Link>
      
      <Link href="/signup" asChild>
            <Pressable style={{
              width: 200,
              height: 50,
              backgroundColor:'#266e26', 
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center'
            }}>

            <Text style={{
              color:'white',
              fontSize: 16,
              fontWeight: 'bold'
            }}>
              Sign in
            </Text>
          </Pressable>
        </Link> 
    </View>
  );
}
