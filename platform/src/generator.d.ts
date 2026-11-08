declare const BITKIT: {
  normalize(d: unknown): any;
  problems(d: any): string[];
  generate(d: any, now?: Date, opts?: { source?: string }): { kit: any; files: Record<string, string> };
  tar(files: Record<string, string>, root: string, mtime?: number): Uint8Array<ArrayBuffer>;
  setupScript(o: { id: string; slug: string; name: string; sha: string; origin?: string }): string;
};
export default BITKIT;
