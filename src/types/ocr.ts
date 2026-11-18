export type ProcessingMode = 'extract_and_verify' | 'ocr_only' | 'verify_only';

export type VerificationVerdict = 'verified' | 'needs_review' | 'flagged';

export type RuleStatus = 'passed' | 'failed' | 'inconclusive';

export type FieldSourceType = 'printed' | 'handwritten' | 'stamp' | 'signature' | 'inferred';

export type BlockType =
  | 'header'
  | 'paragraph'
  | 'handwritten'
  | 'table'
  | 'signature'
  | 'stamp'
  | 'checkbox';

export type CheckCategory =
  | 'mathematical'
  | 'completeness'
  | 'consistency'
  | 'authenticity'
  | 'legibility'
  | 'custom_rule';

export interface ExtractedField {
  key: string;
  value: string;
  sourceType: FieldSourceType;
  confidence: number;
}

export interface ExtractedBlock {
  id: string;
  blockType: BlockType;
  text: string;
  confidence: number;
}

export interface ExtractedTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface VerificationCheck {
  checkName: string;
  category: CheckCategory;
  status: RuleStatus;
  detail: string;
  evidence: string;
}

export interface DocumentClassification {
  documentType: string;
  summary: string;
  languages: string[];
  containsHandwriting: boolean;
  containsSignatures: boolean;
  containsStamps: boolean;
  estimatedPages: number;
  legibilityScore: number;
}

export interface ExtractionPayload {
  rawText: string;
  blocks: ExtractedBlock[];
  fields: ExtractedField[];
  tables: ExtractedTable[];
  handwritingTranscript: string;
}

export interface VerificationPayload {
  overallStatus: VerificationVerdict;
  confidenceScore: number;
  verdictSummary: string;
  anomalyFlags: string[];
  checks: VerificationCheck[];
}

export interface OcrDocumentResult {
  requestId: string;
  processedAt: string;
  durationMs: number;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  mode: ProcessingMode;
  documentClassification: DocumentClassification;
  extraction: ExtractionPayload;
  verification: VerificationPayload;
}

export interface LedgerEntry {
  requestId: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  documentType: string;
  containsHandwriting: boolean;
  overallStatus: VerificationVerdict;
  confidenceScore: number;
  durationMs: number;
  processedAt: string;
  result: OcrDocumentResult;
}

export interface SampleDocumentPreset {
  id: string;
  title: string;
  category: string;
  formatLabel: string;
  description: string;
  imageUrl: string;
  fileName: string;
  defaultRules: string[];
  defaultCustomFields: string[];
}
