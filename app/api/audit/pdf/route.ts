import { NextRequest, NextResponse } from 'next/server'

function buildMinimalPdf(text: string): Uint8Array {
  const lines = [
    '%PDF-1.2',
    '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj',
    '2 0 obj<</Type/Pages/Count 1/Kids [3 0 R]>>endobj',
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox [0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj',
  ]

  const streamText = `BT /F1 12 Tf 50 760 Td (${text.replace(/\(/g, '\\(').replace(/\)/g, '\\)')}) Tj ET`;
  const stream = `4 0 obj<</Length ${streamText.length}>>stream\n${streamText}\nendstream endobj`
  const font = '5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj'

  const content = [...lines, stream, font]
  const xrefOffset = content.join('\n').length + 1
  const xref = [
    'xref',
    '0 6',
    '0000000000 65535 f ',
    '0000000010 00000 n ',
    '0000000060 00000 n ',
    '0000000117 00000 n ',
    `0000000219 00000 n `,
    '0000000316 00000 n ',
  ]
  const trailer = `trailer<</Size 6/Root 1 0 R>>startxref\n${xrefOffset}\n%%EOF`

  const final = content.join('\n') + '\n' + xref.join('\n') + '\n' + trailer
  return new TextEncoder().encode(final)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const content = typeof body.content === 'string' ? body.content : JSON.stringify(body, null, 2)
    const pdfData = buildMinimalPdf(content.slice(0, 1000))

    const arrayBuffer = pdfData.buffer.slice(pdfData.byteOffset, pdfData.byteOffset + pdfData.byteLength) as ArrayBuffer
    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="audit.pdf"',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
