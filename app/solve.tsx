import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform, Text, KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';
import StyledButton from '@/components/StyledButton';
import { Picker } from '@react-native-picker/picker';
import { submitSolution } from '@/api/submissions';

export default function SolveScreen() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [isLoading, setIsLoading] = useState(false);
  const { problemId, problemTitle, contestId } = useLocalSearchParams<{ problemId: string, problemTitle: string, contestId?: string }>();

  const handleSubmit = async () => {
    // ...
    setIsLoading(true);
    try {
        // SỬ DỤNG contestId KHI GỌI API
        const result = await submitSolution(problemId, code, language, contestId);
        router.replace({ pathname: '/submission/[id]', params: { id: result.submissionId } });
    } catch (error: any) {
        Alert.alert('Lỗi', error.error || 'Không thể nộp bài.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    // Sử dụng KeyboardAvoidingView để bàn phím không che code editor
    <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
    >
      <Text style={styles.title}>{problemTitle || 'Giải bài toán'}</Text>
      
      <View style={styles.pickerContainer}>
        <Picker
            selectedValue={language}
            onValueChange={(itemValue) => setLanguage(itemValue)}
            style={styles.picker}
        >
            <Picker.Item label="C++" value="cpp" />
            <Picker.Item label="Python" value="python" />
        </Picker>
      </View>

      {/* ========================================================== */}
      {/* SỬA LỖI Ở ĐÂY: Bọc CodeEditor trong một View linh hoạt */}
      {/* ========================================================== */}
      <View style={styles.editorContainer}>
        <CodeEditor
          style={styles.codeEditor}
          language={language as any}
          syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
          showLineNumbers
          onChange={setCode}
          initialValue="// Viết code của bạn ở đây"
        />
      </View>

      <View style={styles.buttonContainer}>
          <StyledButton title="Nộp bài" onPress={handleSubmit} isLoading={isLoading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1E1E1E' },
    title: { 
        color: 'white', 
        fontSize: 18, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        paddingVertical: 15,
        paddingTop: Platform.OS === 'ios' ? 50 : 15, // Thêm padding cho tai thỏ iPhone
        backgroundColor: '#252526'
    },
    pickerContainer: {
        backgroundColor: '#252526',
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 8,
        ...Platform.select({
            ios: { padding: 10, }
        })
    },
    picker: {
        color: 'white',
        ...Platform.select({
            android: { backgroundColor: '#252526', }
        })
    },
    // ==========================================================
    // THÊM STYLE MỚI VÀ SỬA LẠI STYLE CŨ
    // ==========================================================
    editorContainer: {
        flex: 1, // Container này sẽ chiếm không gian linh hoạt
        margin: 10,
        borderRadius: 8,
        overflow: 'hidden', // Đảm bảo code editor không tràn ra ngoài
    },
    codeEditor: {
        flex: 1, // Code editor sẽ chiếm toàn bộ không gian của container cha
        fontSize: 14,
        padding: 10,
    },
    buttonContainer: {
        padding: 20,
        backgroundColor: '#252526',
        borderTopWidth: 1,
        borderTopColor: '#333'
    }
});