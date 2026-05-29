import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { createPgPool } from "../src/lib/pg-pool";

const pool = createPgPool();
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const colleges = [
  { name: "Indian Institute of Technology Bombay", city: "Mumbai", state: "Maharashtra", rating: 4.9, annualFeesINR: 230000 },
  { name: "Indian Institute of Technology Delhi", city: "New Delhi", state: "Delhi", rating: 4.9, annualFeesINR: 225000 },
  { name: "Indian Institute of Technology Madras", city: "Chennai", state: "Tamil Nadu", rating: 4.8, annualFeesINR: 220000 },
  { name: "Indian Institute of Technology Kanpur", city: "Kanpur", state: "Uttar Pradesh", rating: 4.8, annualFeesINR: 228000 },
  { name: "Indian Institute of Technology Kharagpur", city: "Kharagpur", state: "West Bengal", rating: 4.8, annualFeesINR: 226000 },
  { name: "Indian Institute of Technology Roorkee", city: "Roorkee", state: "Uttarakhand", rating: 4.7, annualFeesINR: 224000 },
  { name: "Indian Institute of Technology Guwahati", city: "Guwahati", state: "Assam", rating: 4.7, annualFeesINR: 222000 },
  { name: "Indian Institute of Technology Hyderabad", city: "Hyderabad", state: "Telangana", rating: 4.7, annualFeesINR: 235000 },
  { name: "National Institute of Technology Trichy", city: "Tiruchirappalli", state: "Tamil Nadu", rating: 4.6, annualFeesINR: 180000 },
  { name: "National Institute of Technology Surathkal", city: "Mangalore", state: "Karnataka", rating: 4.6, annualFeesINR: 175000 },
  { name: "National Institute of Technology Warangal", city: "Warangal", state: "Telangana", rating: 4.5, annualFeesINR: 170000 },
  { name: "Birla Institute of Technology and Science Pilani", city: "Pilani", state: "Rajasthan", rating: 4.7, annualFeesINR: 450000 },
  { name: "Delhi Technological University", city: "New Delhi", state: "Delhi", rating: 4.4, annualFeesINR: 160000 },
  { name: "Vellore Institute of Technology", city: "Vellore", state: "Tamil Nadu", rating: 4.3, annualFeesINR: 198000 },
  { name: "Manipal Institute of Technology", city: "Manipal", state: "Karnataka", rating: 4.4, annualFeesINR: 380000 },
  { name: "SRM Institute of Science and Technology", city: "Chennai", state: "Tamil Nadu", rating: 4.2, annualFeesINR: 260000 },
  { name: "Thapar Institute of Engineering and Technology", city: "Patiala", state: "Punjab", rating: 4.5, annualFeesINR: 420000 },
  { name: "PES University", city: "Bangalore", state: "Karnataka", rating: 4.3, annualFeesINR: 350000 },
  { name: "RV College of Engineering", city: "Bangalore", state: "Karnataka", rating: 4.4, annualFeesINR: 120000 },
  { name: "BMS College of Engineering", city: "Bangalore", state: "Karnataka", rating: 4.2, annualFeesINR: 90000 },
  { name: "College of Engineering Pune", city: "Pune", state: "Maharashtra", rating: 4.5, annualFeesINR: 85000 },
  { name: "Veermata Jijabai Technological Institute", city: "Mumbai", state: "Maharashtra", rating: 4.4, annualFeesINR: 75000 },
  { name: "Symbiosis Institute of Technology", city: "Pune", state: "Maharashtra", rating: 4.3, annualFeesINR: 320000 },
  { name: "Amity University Noida", city: "Noida", state: "Uttar Pradesh", rating: 4.0, annualFeesINR: 280000 },
  { name: "Lovely Professional University", city: "Phagwara", state: "Punjab", rating: 4.1, annualFeesINR: 240000 },
  { name: "Chandigarh University", city: "Mohali", state: "Punjab", rating: 4.2, annualFeesINR: 220000 },
  { name: "Bennett University", city: "Greater Noida", state: "Uttar Pradesh", rating: 4.1, annualFeesINR: 340000 },
  { name: "Shiv Nadar University", city: "Greater Noida", state: "Uttar Pradesh", rating: 4.4, annualFeesINR: 480000 },
  { name: "Ashoka University", city: "Sonipat", state: "Haryana", rating: 4.6, annualFeesINR: 950000 },
  { name: "Christ University", city: "Bangalore", state: "Karnataka", rating: 4.3, annualFeesINR: 210000 },
  { name: "St. Xavier's College Mumbai", city: "Mumbai", state: "Maharashtra", rating: 4.5, annualFeesINR: 65000 },
  { name: "Hindu College Delhi", city: "New Delhi", state: "Delhi", rating: 4.6, annualFeesINR: 45000 },
  { name: "Lady Shri Ram College", city: "New Delhi", state: "Delhi", rating: 4.7, annualFeesINR: 48000 },
  { name: "Fergusson College Pune", city: "Pune", state: "Maharashtra", rating: 4.4, annualFeesINR: 42000 },
  { name: "Presidency College Chennai", city: "Chennai", state: "Tamil Nadu", rating: 4.5, annualFeesINR: 38000 },
  { name: "Anna University College of Engineering", city: "Chennai", state: "Tamil Nadu", rating: 4.4, annualFeesINR: 55000 },
  { name: "Jadavpur University", city: "Kolkata", state: "West Bengal", rating: 4.6, annualFeesINR: 12000 },
  { name: "Institute of Chemical Technology Mumbai", city: "Mumbai", state: "Maharashtra", rating: 4.5, annualFeesINR: 95000 },
  { name: "National Institute of Fashion Technology Delhi", city: "New Delhi", state: "Delhi", rating: 4.3, annualFeesINR: 185000 },
  { name: "Indian Institute of Science Bangalore", city: "Bangalore", state: "Karnataka", rating: 4.9, annualFeesINR: 75000 },
];

const reviewSnippets = [
  "Great campus culture and strong alumni network.",
  "Faculty is knowledgeable and industry-connected.",
  "Placement support has improved significantly in recent years.",
  "Infrastructure is modern with good lab facilities.",
  "Competitive environment that pushes students to perform.",
];

async function main() {
  await prisma.savedComparison.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.placementStat.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  for (const item of colleges) {
    const slug = slugify(item.name);
    const college = await prisma.college.create({
      data: {
        name: item.name,
        slug,
        city: item.city,
        state: item.state,
        rating: item.rating,
        annualFeesINR: item.annualFeesINR,
        overview: `${item.name} is a well-regarded institution located in ${item.city}, ${item.state}. It offers strong academic programs, active campus life, and career opportunities across engineering, sciences, and professional courses. Students benefit from experienced faculty, modern infrastructure, and industry partnerships that support internships and placements.`,
        courses: {
          create: [
            {
              name: "Computer Science and Engineering",
              degree: "B.Tech",
              durationYears: 4,
              feesINR: item.annualFeesINR,
            },
            {
              name: "Electronics and Communication",
              degree: "B.Tech",
              durationYears: 4,
              feesINR: Math.round(item.annualFeesINR * 0.95),
            },
            {
              name: "Mechanical Engineering",
              degree: "B.Tech",
              durationYears: 4,
              feesINR: Math.round(item.annualFeesINR * 0.92),
            },
          ],
        },
        placements: {
          create: [
            {
              year: 2024,
              avgPackageLPA: Number((item.rating * 2.2).toFixed(1)),
              highestPackageLPA: Number((item.rating * 5.5).toFixed(1)),
              placementPercent: Math.min(98, Math.round(item.rating * 20)),
            },
            {
              year: 2023,
              avgPackageLPA: Number((item.rating * 2.0).toFixed(1)),
              highestPackageLPA: Number((item.rating * 5.0).toFixed(1)),
              placementPercent: Math.min(95, Math.round(item.rating * 19)),
            },
          ],
        },
        reviews: {
          create: reviewSnippets.slice(0, 3).map((content, index) => ({
            authorName: `Student ${index + 1}`,
            rating: Math.min(5, Math.round(item.rating)),
            content,
          })),
        },
      },
    });
    console.log(`Seeded ${college.name}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
