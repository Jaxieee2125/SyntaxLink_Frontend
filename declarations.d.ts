// Tệp này sẽ chứa các khai báo cho các module không có sẵn types

// Khai báo cho 'react-native-code-editor'
declare module 'react-native-code-editor' {
  import { StyleProp, ViewStyle } from 'react-native';
  import React from 'react';

  // Định nghĩa các props cho component CodeEditor
  interface CodeEditorProps {
    style?: StyleProp<ViewStyle>;
    language?: 'javascript' | 'python' | 'cpp' | 'java' | 'html'; // Thêm các ngôn ngữ bạn hỗ trợ
    syntaxStyle?: any; // Kiểu dữ liệu không rõ, dùng 'any'
    showLineNumbers?: boolean;
    onChange?: (code: string) => void;
    initialValue?: string;
    readOnly?: boolean;
  }

  // Khai báo component chính
  const CodeEditor: React.ComponentType<CodeEditorProps>;
  export default CodeEditor;

  // Khai báo cho object CodeEditorSyntaxStyles
  export const CodeEditorSyntaxStyles: {
    [key: string]: any; // Một object chứa nhiều style, dùng 'any' cho đơn giản
  };

}

declare module 'react-native-html-to-pdf' {
  // Định nghĩa các tùy chọn cho hàm convert
  interface Options {
    html: string;
    fileName?: string;
    directory?: string;
    // Thêm các tùy chọn khác nếu bạn cần
    // width?: number;
    // height?: number;
  }

  // Định nghĩa kết quả trả về của hàm convert
  interface File {
    uri: string;
    // Thêm các thuộc tính khác nếu có
    // filePath: string;
    // base64: string;
  }

  // Khai báo rằng module này export ra một hàm tên là 'convert'
  export function convert(options: Options): Promise<File>;
}