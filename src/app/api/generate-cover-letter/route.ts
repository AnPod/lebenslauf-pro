import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, cvData, companyName, position } = await request.json();

    const prompt = `Erstelle ein professionelles Anschreiben auf Deutsch für die Position "${position}" bei "${companyName}".

Informationen zum Bewerber:
- Name: ${cvData.personal.firstName} ${cvData.personal.lastName}
- Aktuelle Position: ${cvData.experience[0]?.position || 'Siehe Lebenslauf'}
- Erfahrung: ${cvData.experience.map((e: any) => e.position).join(', ')}
- Ausbildung: ${cvData.education.map((e: any) => e.degree).join(', ')}

Stellenbeschreibung:
${jobDescription}

Das Anschreiben sollte:
1. Deutsch sein (formell aber persönlich)
2. Das klassische deutsche Anschreiben-Format haben
3. Bezug auf die Stellenanforderungen nehmen
4. Konkrete Beispiele aus der Erfahrung nennen
5. Maximal 1 Seite umfassen
6. Mit "Mit freundlichen Grüßen" enden

Format:
- Betreff: Bewerbung als [Position]
- Einleitung: Warum diese Firma, Warum diese Position
- Hauptteil: Qualifikationen passend zu den Anforderungen
- Schluss: Nächste Schritte, Verfügbarkeit`;

    const completion = await openai.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein erfahrener Karriereberater, der professionelle deutsche Anschreiben für Bewerbungen erstellt. Du kennst die Konventionen des DACH-Raums (Deutschland, Österreich, Schweiz).',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    const coverLetter = completion.choices[0].message.content;

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}