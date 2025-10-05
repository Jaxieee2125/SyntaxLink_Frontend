import { Text, View } from "react-native";
function Chip({ label, color, textColor }: { label: string; color: string; textColor: string }) {
  return (
    <View style={{
      backgroundColor: color,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 100,
    }}>
      <Text style={{ color: textColor, fontSize: 12, fontWeight: "600" }}>{label}</Text>
    </View>
  );
}

export default Chip;