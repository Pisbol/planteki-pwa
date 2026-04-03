import { View, Text, TextInput, Pressable, Modal } from "react-native";
import { useState } from "react";

type AddPlantFormProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (plant: { name: string; species: string; notes: string }) => void;
};

export default function AddPlantForm({ visible, onClose, onSave }: AddPlantFormProps) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name, species, notes });
      setName(""); setSpecies(""); setNotes(""); // clear form
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"rgba(0,0,0,0.5)" }}>
        <View style={{ width:300, backgroundColor:"white", borderRadius:12, padding:20 }}>
          <Text style={{ fontSize:20, fontWeight:"bold", color:"#1d521d", marginBottom:15, textAlign:"center" }}>
            Add Plant
          </Text>

          <TextInput placeholder="Plant Name" value={name} onChangeText={setName}
            style={{ borderWidth:1, borderColor:"#ccc", borderRadius:8, paddingHorizontal:10, height:40, marginBottom:12 }} />

          <TextInput placeholder="Species" value={species} onChangeText={setSpecies}
            style={{ borderWidth:1, borderColor:"#ccc", borderRadius:8, paddingHorizontal:10, height:40, marginBottom:12 }} />

          <TextInput placeholder="Care Notes" value={notes} onChangeText={setNotes} multiline
            style={{ borderWidth:1, borderColor:"#ccc", borderRadius:8, paddingHorizontal:10, height:80, marginBottom:20, textAlignVertical:"top" }} />

          <Pressable onPress={handleSave} style={{ backgroundColor:"#266e26", paddingVertical:12, borderRadius:8, alignItems:"center", marginBottom:10 }}>
            <Text style={{ color:"white", fontWeight:"bold" }}>Save Plant</Text>
          </Pressable>

          <Pressable onPress={onClose} style={{ backgroundColor:"#ccc", paddingVertical:12, borderRadius:8, alignItems:"center" }}>
            <Text style={{ color:"#333", fontWeight:"bold" }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
