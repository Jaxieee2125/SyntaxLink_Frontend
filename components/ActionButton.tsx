import { Text, TouchableOpacity } from "react-native";
function ActionButton({
  label,
  onPress,
  color,
  textColor = "#000",
  border,
  style = {},
}: {
  label: string;
  onPress: () => void;
  color: string;
  textColor?: string;
  border?: string;
  style?: object;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        {
          backgroundColor: color,
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 14,
          borderWidth: border ? 1 : 0,
          borderColor: border ?? "transparent",
        },
        style,
      ]}
    >
      <Text
        style={{
          color: textColor,
          fontWeight: "700",
          fontSize: 15,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default ActionButton;