import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import AddPlantForm from "../AddPlantForm";

export default function DashboardScreen() {
  const [showForm, setShowForm] = useState(false);
  const [plants, setPlants] = useState<{ name: string; species: string; notes: string }[]>([]);

  const handleSavePlant = (plant: { name: string; species: string; notes: string }) => {
    setPlants([...plants, plant]);
  };

  return (
    <View style={{ flex:1, backgroundColor:"#f5f5f5", padding:20 }}>
      <Text style={{ fontSize:28, fontWeight:"bold", color:"#1d521d", marginBottom:20 }}>My Plants</Text>

      {plants.length === 0 ? (
        <View style={{ alignItems:"center", marginTop:50 }}>
          <Text style={{ fontSize:16, color:"#424242", marginBottom:20 }}>
            No plants yet. Add your first one!
          </Text>
        </View>
      ) : (
        plants.map((plant, idx) => (
          <View key={idx} style={{ backgroundColor:"white", padding:15, borderRadius:8, marginBottom:10 }}>
            <Text style={{ fontSize:18, fontWeight:"bold", color:"#1d521d" }}>{plant.name}</Text>
            <Text style={{ color:"#555" }}>{plant.species}</Text>
            <Text style={{ color:"#777", marginTop:5 }}>{plant.notes}</Text>
          </View>
        ))
      )}

      <Pressable onPress={() => setShowForm(true)} style={{ backgroundColor:"#266e26", paddingVertical:15, borderRadius:8, alignItems:"center", marginTop:20 }}>
        <Text style={{ color:"white", fontWeight:"bold" }}>+ Add Plant</Text>
      </Pressable>

      <AddPlantForm visible={showForm} onClose={() => setShowForm(false)} onSave={handleSavePlant} />
    </View>
  );
}
