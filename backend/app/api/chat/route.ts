export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Call the medical API
    const medicalApiResponse = await fetch("http://40.81.244.202:8001/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    });

    if (!medicalApiResponse.ok) {
      console.error("Medical API error:", medicalApiResponse.status);
      return Response.json(
        { error: "Failed to get response from medical API" },
        { status: 502 }
      );
    }

    const medicalData = await medicalApiResponse.json();

    // Extract only the response field
    const response = medicalData.response || "ไม่สามารถรับข้อมูลได้ในขณะนี้";

    // Return only the response text
    return Response.json({
      response: response,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return Response.json(
      {
        error: "Internal server error",
        response: "เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ กรุณาลองใหม่อีกครั้ง",
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
