import { View, Text, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { JobPosting } from '@/types/job';

export default function JobCard({ item, onPress }: { item: JobPosting; onPress: () => void }) {
  const theme = Colors[useColorScheme() ?? 'light'];
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: theme.surfaceElevated,
        borderColor: theme.outline,
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
        marginHorizontal: 12,
        marginVertical: 8,
      }}
    >
      <Text style={{ color: theme.text, fontWeight: '700' }}>{item.title}</Text>
      <Text style={{ color: theme.textMuted, marginTop: 4 }}>
        {item.location} • {item.salaryRange}
      </Text>
      <Text style={{ color: theme.textMuted, marginTop: 4 }}>
        Trạng thái: {item.moderationStatus}
      </Text>
    </TouchableOpacity>
  );
}
