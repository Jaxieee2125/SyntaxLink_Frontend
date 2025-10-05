import { Text, useColorScheme, View } from "react-native";
import Colors from "@/constants/Colors";
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = Colors[useColorScheme() ?? "light"];
  return (
    <View style={{
      padding: 14,
      borderRadius: 12,
      backgroundColor: theme.inputBg,
      marginTop: 16,
    }}>
      <Text style={{ color: theme.text, fontWeight: "700", marginBottom: 10 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

export default Section;
