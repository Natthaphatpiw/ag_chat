export const maxDuration = 90;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, query } = body;

    if (!message && !query) {
      return Response.json(
        { error: "Message or query is required" },
        { status: 400 }
      );
    }

    const userMessage = message || query;

    // Call the medical API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 85000); // 85 seconds timeout

    try {
      const medicalApiResponse = await fetch("http://40.81.244.202:8001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage,
          top_k: 3
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!medicalApiResponse.ok) {
        console.error("Medical API error:", medicalApiResponse.status);
        const errorText = await medicalApiResponse.text();
        console.error("Medical API error body:", errorText);
        return Response.json(
          { error: "Failed to get response from medical API" },
          { status: 502 }
        );
      }

      const medicalData = await medicalApiResponse.json();
      console.log("Medical API response:", medicalData);

      // Extract only the response field
      const response = medicalData.response || "ไม่สามารถรับข้อมูลได้ในขณะนี้";

      // Return only the response text
      return Response.json({
        response: response,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("Fetch error:", fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error("Error in chat API:", error);
    const errorMessage = error instanceof Error && error.name === 'AbortError' 
      ? "AI server ใช้เวลาตอบนานเกินไป กรุณาลองใหม่อีกครั้ง"
      : "เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ กรุณาลองใหม่อีกครั้ง";
    
    return Response.json(
      {
        error: "Internal server error",
        response: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
