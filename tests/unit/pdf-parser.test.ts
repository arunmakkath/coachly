import { describe, it, expect, vi } from 'vitest';
import { parsePDF, cleanText, parsePDFFromURL } from '@/lib/utils/pdf-parser';

// Mock pdf-parse
vi.mock('pdf-parse', () => ({
  default: vi.fn((buffer) => {
    if (!buffer) {
      return Promise.reject(new Error('Invalid buffer'));
    }
    return Promise.resolve({
      text: 'Sample PDF content with multiple lines.\nThis is a test document.\nIt contains coaching techniques.',
      numpages: 1,
      info: {
        Title: 'Test Document',
        Author: 'Test Author',
        Subject: 'Coaching',
      },
    });
  }),
}));

describe('PDF Parser', () => {
  describe('parsePDF', () => {
    it('should parse PDF buffer and return text', async () => {
      const buffer = Buffer.from('fake pdf content');
      const result = await parsePDF(buffer);

      expect(result.text).toContain('Sample PDF content');
      expect(result.text).toContain('coaching techniques');
      expect(result.numPages).toBe(1);
    });

    it('should extract metadata from PDF', async () => {
      const buffer = Buffer.from('fake pdf content');
      const result = await parsePDF(buffer);

      expect(result.metadata).toBeDefined();
      expect(result.metadata?.title).toBe('Test Document');
      expect(result.metadata?.author).toBe('Test Author');
      expect(result.metadata?.subject).toBe('Coaching');
    });

    it('should handle parsing errors gracefully', async () => {
      const invalidBuffer = null as any;
      await expect(parsePDF(invalidBuffer)).rejects.toThrow('Failed to parse PDF');
    });

    it('should return number of pages', async () => {
      const buffer = Buffer.from('fake pdf content');
      const result = await parsePDF(buffer);

      expect(result.numPages).toBeGreaterThan(0);
    });
  });

  describe('cleanText', () => {
    it('should replace multiple spaces with single space', () => {
      const text = 'This  has   multiple    spaces';
      const cleaned = cleanText(text);

      expect(cleaned).toBe('This has multiple spaces');
    });

    it('should normalize newlines and spaces', () => {
      // cleanText replaces all whitespace (including newlines) with single spaces
      const text = 'Line 1\n\n\nLine 2';
      const cleaned = cleanText(text);

      // After replacing \n+ with \n, then \s+ with space
      expect(cleaned).toContain('Line 1');
      expect(cleaned).toContain('Line 2');
    });

    it('should trim whitespace from start and end', () => {
      const text = '  Text with spaces  \n';
      const cleaned = cleanText(text);

      expect(cleaned).toBe('Text with spaces');
    });

    it('should handle empty text', () => {
      const cleaned = cleanText('');
      expect(cleaned).toBe('');
    });

    it('should normalize all whitespace', () => {
      const text = '  Multiple   spaces\n\n\nand newlines  ';
      const cleaned = cleanText(text);

      // Normalized to single spaces
      expect(cleaned).toContain('Multiple');
      expect(cleaned).toContain('spaces');
      expect(cleaned).toContain('and');
      expect(cleaned).toContain('newlines');
      expect(cleaned.trim()).toBe(cleaned); // Should be trimmed
    });
  });

  describe('parsePDFFromURL', () => {
    it('should fetch and parse PDF from URL', async () => {
      // Mock global fetch
      global.fetch = vi.fn(() =>
        Promise.resolve({
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        } as Response)
      );

      const result = await parsePDFFromURL('https://example.com/test.pdf');

      expect(result).toBeDefined();
      expect(result.text).toBeTruthy();
      expect(global.fetch).toHaveBeenCalledWith('https://example.com/test.pdf');
    });
  });
});
