/**
 * FormatterService - Code formatting service
 * 
 * Provides code formatting for various languages.
 * Uses simple formatting rules for now (can be enhanced with Prettier/Black later)
 */

export class FormatterService {
  /**
   * Format code based on language
   */
  static format(code: string, language: string, tabSize: number = 4): string {
    switch (language) {
      case 'python':
        return this.formatPython(code, tabSize);
      case 'javascript':
      case 'typescript':
        return this.formatJavaScript(code, tabSize);
      case 'json':
        return this.formatJSON(code, tabSize);
      case 'sql':
        return this.formatSQL(code);
      default:
        return code;
    }
  }

  /**
   * Format Python code (basic indentation and spacing)
   */
  private static formatPython(code: string, tabSize: number): string {
    const lines = code.split('\n');
    const formatted: string[] = [];
    let indentLevel = 0;
    const indent = ' '.repeat(tabSize);

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      // Skip empty lines
      if (!line) {
        formatted.push('');
        continue;
      }

      // Decrease indent for dedent keywords
      if (line.match(/^(return|break|continue|pass|raise|elif|else|except|finally)/)) {
        if (indentLevel > 0 && !line.startsWith('elif') && !line.startsWith('else') && !line.startsWith('except') && !line.startsWith('finally')) {
          // Don't dedent for these keywords
        }
      }

      // Handle dedent for else, elif, except, finally
      if (line.match(/^(else|elif|except|finally):/)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Add current line with proper indentation
      formatted.push(indent.repeat(indentLevel) + line);

      // Increase indent after colon (function, class, if, for, while, etc.)
      if (line.endsWith(':')) {
        indentLevel++;
      }

      // Decrease indent after return, break, continue, pass, raise (if not in a block)
      if (line.match(/^(return|break|continue|pass|raise)/) && !line.endsWith(':')) {
        // Check if next line is dedented
        const nextLine = lines[i + 1]?.trim();
        if (nextLine && !nextLine.startsWith(' ') && indentLevel > 0) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
      }
    }

    return formatted.join('\n');
  }

  /**
   * Format JavaScript/TypeScript code (basic)
   */
  private static formatJavaScript(code: string, tabSize: number): string {
    const lines = code.split('\n');
    const formatted: string[] = [];
    let indentLevel = 0;
    const indent = ' '.repeat(tabSize);

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip empty lines
      if (!trimmed) {
        formatted.push('');
        continue;
      }

      // Decrease indent for closing braces
      if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Add current line with proper indentation
      formatted.push(indent.repeat(indentLevel) + trimmed);

      // Increase indent after opening braces
      if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
        indentLevel++;
      }

      // Decrease indent after closing braces on same line
      if (trimmed.includes('}') && !trimmed.endsWith('{')) {
        const openCount = (trimmed.match(/{/g) || []).length;
        const closeCount = (trimmed.match(/}/g) || []).length;
        indentLevel = Math.max(0, indentLevel - (closeCount - openCount));
      }
    }

    return formatted.join('\n');
  }

  /**
   * Format JSON code
   */
  private static formatJSON(code: string, tabSize: number): string {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed, null, tabSize);
    } catch (error) {
      // If JSON is invalid, return as-is
      return code;
    }
  }

  /**
   * Format SQL code (basic)
   */
  private static formatSQL(code: string): string {
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
      'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
      'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
      'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE'
    ];

    let formatted = code;

    // Add newlines before major keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${keyword}`);
    });

    // Clean up extra whitespace
    formatted = formatted
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    return formatted;
  }

  /**
   * Check if code can be formatted
   */
  static canFormat(language: string): boolean {
    return ['python', 'javascript', 'typescript', 'json', 'sql'].includes(language);
  }
}

export const formatterService = new FormatterService();
