import type { ProjectDetail } from '@/types/project-detail';

const snippets = {
  threatStream: `// Real-time threat stream with auto-reconnect
const useThreatStream = (endpoint: string) => {
  const [threats, setThreats] = useState<Threat[]>([]);
  useEffect(() => {
    let ws: WebSocket;
    let retries = 0;
    const connect = () => {
      ws = new WebSocket(endpoint);
      ws.onmessage = ({ data }) => {
        const threat = JSON.parse(data) as Threat;
        setThreats(prev => [threat, ...prev].slice(0, 1000));
      };
      ws.onclose = () => {
        if (retries < 5) setTimeout(connect, Math.pow(2, retries++) * 1000);
      };
    };
    connect();
    return () => ws?.close();
  }, [endpoint]);
  return threats;
};`,
  dataTable: `// Type-safe composable DataTable component
interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
  virtualize?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  data, columns, onRowClick, virtualize = data.length > 200
}: DataTableProps<T>) {
  const { sorted, handleSort } = useSortable(data);
  const Component = virtualize ? VirtualTable : StandardTable;
  return <Component data={sorted} columns={columns} onRowClick={onRowClick}
    onSort={handleSort} aria-label="Data table" role="grid" />;
}`,
  attackNode: `// Canvas node renderer with selection and drag
class AttackNode {
  constructor(
    public id: string,
    public x: number,
    public y: number,
    public type: 'asset' | 'vuln' | 'entry',
    public cvss: number
  ) {}

  render(ctx: CanvasRenderingContext2D, selected: boolean) {
    const color = this.type === 'entry' ? '#FF3B6B'
      : this.cvss > 7 ? '#FFB800' : '#00FF87';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 24, 0, Math.PI * 2);
    ctx.fillStyle = color + '15';
    ctx.fill();
    ctx.strokeStyle = selected ? '#fff' : color;
    ctx.stroke();
  }
}`,
  glyphRenderer: `// WebGL glyph renderer — batched draw calls
class GlyphRenderer {
  private atlas: GlyphAtlas;
  private vertexBuffer: Float32Array;

  constructor(gl: WebGL2RenderingContext) {
    this.atlas = new GlyphAtlas(gl, { size: 2048 });
    this.vertexBuffer = new Float32Array(MAX_GLYPHS * 6 * 4);
  }

  render(cells: TerminalCell[], viewport: Rect) {
    let idx = 0;
    for (const cell of cells) {
      const glyph = this.atlas.get(cell.char, cell.attrs);
      this.writeQuad(this.vertexBuffer, idx, glyph, cell);
      idx += 24;
    }
    this.gl.bufferSubData(ARRAY_BUFFER, 0, this.vertexBuffer, 0, idx);
    this.gl.drawArrays(TRIANGLES, 0, idx / 4);
  }
}`,
} as const;

export const projectDetails: Record<string, ProjectDetail> = {
  'cipher-shield': {
    challenge:
      'Enterprise clients needed sub-100ms threat detection with a zero-downtime requirement. Legacy SIEM tools were producing 40% false positives, causing alert fatigue.',
    solution:
      'Architected a streaming data pipeline using WebSocket + Redis Pub/Sub. Built a custom ML inference layer in Python (FastAPI) and a React dashboard with virtualized lists for 100K+ event rows.',
    impact:
      'Reduced mean time to detect (MTTD) from 8 minutes to 47 seconds. False positive rate dropped to 0.8%.',
    timeline: '6 months',
    teamSize: '4 engineers',
    role: 'Frontend Lead + Security Architect',
    highlights: [
      'Real-time WebSocket event streaming with automatic reconnection',
      'Custom rule engine with drag-and-drop threat logic builder',
      'End-to-end encrypted audit logs with tamper detection',
      'Automated compliance reports (SOC2, ISO27001)',
    ],
    codeSnippet: snippets.threatStream,
  },
  'nexus-ui': {
    challenge:
      "Security teams needed data-dense UIs that were still accessible. Existing component libraries weren't designed for dark environments or real-time data.",
    solution:
      'Built a design system from scratch — tokens first, components second. Every component has keyboard navigation, screen reader support, and motion preferences respected.',
    impact:
      'Adopted by 6 internal products. 14K monthly npm downloads. 98/100 Lighthouse accessibility score.',
    timeline: '4 months (ongoing)',
    teamSize: 'Solo project',
    role: 'Design System Architect',
    highlights: [
      '60+ production-grade components with full TypeScript generics',
      'Zero dependencies except React — tiny bundle footprint',
      'Automated visual regression tests with Chromatic',
      'Full Storybook documentation with accessibility annotations',
    ],
    codeSnippet: snippets.dataTable,
  },
  'pentest-canvas': {
    challenge:
      'Security teams used spreadsheets and markdown files to map attack surfaces. No visual tool existed that matched their workflow and integrated with existing security tooling.',
    solution:
      'Built a canvas-based visual editor using the HTML5 Canvas API. Nodes represent assets, edges represent attack paths. Integrates live with ZAP and Burp via their REST APIs.',
    impact:
      'Used by 340+ security professionals. Cut report generation time from 3 hours to 25 minutes.',
    timeline: '5 months',
    teamSize: '2 engineers',
    role: 'Full-stack Developer',
    highlights: [
      'Drag-and-drop attack graph builder with CVSS scoring',
      'Burp Suite and OWASP ZAP API integration',
      'One-click compliance report generation (PDF/DOCX)',
      'Collaborative mode with real-time cursors via WebRTC',
    ],
    codeSnippet: snippets.attackNode,
  },
  waveterm: {
    challenge:
      'Existing terminal emulators rendered with DOM elements, causing frame drops during fast output. SSH workflows required constant context switching.',
    solution:
      'Used WebGL for all text rendering — each glyph is a textured quad on the GPU. Implemented a custom font atlas with subpixel rendering for crisp text at any scale.',
    impact: 'Consistent 60fps at 200,000 lines of scrollback. 4.1K downloads in first 3 months.',
    timeline: '8 months',
    teamSize: 'Solo project',
    role: 'Systems + Frontend Engineer',
    highlights: [
      'WebGL text rendering with custom glyph atlas and font hinting',
      'Native SSH client built in Rust (via NAPI bindings)',
      'Plugin system with JS/WASM runtime sandboxing',
      'Split-pane layout engine with persistent sessions',
    ],
    codeSnippet: snippets.glyphRenderer,
  },
};
