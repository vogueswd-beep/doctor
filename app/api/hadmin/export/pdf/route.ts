import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { formatCreatedAt, getEntries, type EntryFilters } from "@/lib/mongodb";

const PAGE_WIDTH = 595.28; // A4 portrait, points
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;
const ROW_HEIGHT = 22;
const COLUMNS = [
  { label: "Name", width: 140 },
  { label: "Email", width: 170 },
  { label: "Phone", width: 110 },
  { label: "Registered At", width: 95 },
] as const;

function truncate(text: string, maxChars: number) {
  return text.length > maxChars ? `${text.slice(0, maxChars - 1)}…` : text;
}

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const filters: EntryFilters = {
    q: searchParams.get("q") || undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
  };

  const entries = await getEntries(filters);

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const gold = rgb(0.72, 0.53, 0.04);
  const dark = rgb(0.13, 0.13, 0.13);
  const gray = rgb(0.4, 0.4, 0.4);

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  function drawHeader() {
    page.drawText("Vogue Jewellers - Giveaway Registrations", {
      x: MARGIN,
      y,
      size: 14,
      font: boldFont,
      color: dark,
    });
    y -= 18;
    page.drawText(`Generated ${new Date().toLocaleString()} - ${entries.length} entries`, {
      x: MARGIN,
      y,
      size: 9,
      font,
      color: gray,
    });
    y -= 20;
    drawTableHeader();
  }

  function drawTableHeader() {
    let x = MARGIN;
    for (const col of COLUMNS) {
      page.drawText(col.label, { x, y, size: 10, font: boldFont, color: gold });
      x += col.width;
    }
    y -= 6;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 0.75,
      color: gold,
    });
    y -= ROW_HEIGHT - 6;
  }

  function ensureSpace() {
    if (y < MARGIN + ROW_HEIGHT) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
      drawTableHeader();
    }
  }

  drawHeader();

  for (const entry of entries) {
    ensureSpace();
    let x = MARGIN;
    const values = [
      truncate(entry.name, 24),
      truncate(entry.email, 30),
      entry.phone,
      formatCreatedAt(entry.createdAt),
    ];
    values.forEach((value, i) => {
      page.drawText(value, { x, y, size: 9, font, color: dark });
      x += COLUMNS[i].width;
    });
    y -= ROW_HEIGHT;
  }

  if (entries.length === 0) {
    page.drawText("No entries match the applied filters.", {
      x: MARGIN,
      y,
      size: 10,
      font,
      color: gray,
    });
  }

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="vogue-giveaway-entries-${Date.now()}.pdf"`,
    },
  });
}
