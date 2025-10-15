# Medical Chatbot Backend

Backend API สำหรับระบบ AI Medical Assistant ที่ทำหน้าที่เป็นตัวกลางระหว่าง Frontend และ Medical API

## 🚀 Features

- รับคำถามจาก Frontend (port 3000)
- ส่งต่อคำถามไปยัง Medical API (http://40.81.244.202:8001/chat)
- ส่ง response กลับไปยัง Frontend
- รองรับ CORS สำหรับการเชื่อมต่อข้าม origin

## 📦 Installation

```bash
npm install
# หรือ
pnpm install
# หรือ
yarn install
```

## 🏃 Running the Backend

```bash
npm run dev
# หรือ
pnpm dev
# หรือ
yarn dev
```

Backend จะทำงานที่: **http://localhost:8000**

## 🔌 API Endpoints

### POST /api/chat

รับข้อความจากผู้ใช้และส่งต่อไปยัง Medical API

**Request Body:**
```json
{
  "message": "อาการเบื้องต้นของโรคซึมเศร้ามีอะไรบ้าง"
}
```

**Response:**
```json
{
  "response": "อาการเบื้องต้นของโรคซึมเศร้า ได้แก่\n\n- รู้สึกเศร้า เบื่อหน่าย..."
}
```

## 🏗️ Tech Stack

- **Next.js 15** - React Framework
- **TypeScript** - Type Safety
- **Node.js** - Runtime Environment

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # Main API endpoint
│   ├── layout.tsx
│   └── page.tsx
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## 🔒 CORS Configuration

Backend นี้ได้ตั้งค่า CORS ให้รองรับการเชื่อมต่อจาก:
- http://localhost:3000 (Frontend)

หากต้องการเพิ่ม origin อื่น สามารถแก้ไขได้ที่ `next.config.ts`

## 🌐 External API

Backend เชื่อมต่อกับ Medical API ที่:
- **URL**: http://40.81.244.202:8001/chat
- **Method**: POST
- **Content-Type**: application/json

## 📝 Notes

- Backend จะทำงานบน port **8000** เพื่อไม่ให้ชนกับ Frontend (port 3000)
- ตรวจสอบให้แน่ใจว่า Medical API สามารถเข้าถึงได้ก่อนเริ่มใช้งาน
- Log ข้อผิดพลาดจะแสดงใน console เมื่อเกิดปัญหาในการเชื่อมต่อ

## 🔧 Environment

ไม่จำเป็นต้องตั้งค่า environment variables สำหรับ backend นี้ เนื่องจาก Medical API URL ถูก hard-code ไว้ใน route.ts

หากต้องการเปลี่ยน URL ของ Medical API สามารถแก้ไขได้ที่:
`app/api/chat/route.ts` line 14
