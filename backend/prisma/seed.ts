import { PrismaClient, Role, ProblemStatus, Category, Urgency } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.teamNote.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.projectTeam.deleteMany();
  await prisma.statusHistory.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Test@1234', 12);

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: 'Vikram Singh',
      email: 'admin@samadhansetu.gov.in',
      passwordHash,
      role: 'ADMIN',
      organizationName: 'Government of Jharkhand',
      district: 'Ranchi',
      preferredLanguage: 'en',
    },
  });

  const citizen1 = await prisma.user.create({
    data: {
      name: 'Priya Kumar',
      email: 'priya.kumar@gmail.com',
      passwordHash,
      role: 'CITIZEN',
      district: 'Dhanbad',
      preferredLanguage: 'hi',
    },
  });

  const citizen2 = await prisma.user.create({
    data: {
      name: 'Rajesh Oraon',
      email: 'rajesh.oraon@gmail.com',
      passwordHash,
      role: 'CITIZEN',
      district: 'Gumla',
      preferredLanguage: 'hi',
    },
  });

  const citizen3 = await prisma.user.create({
    data: {
      name: 'Anita Devi',
      email: 'anita.devi@gmail.com',
      passwordHash,
      role: 'CITIZEN',
      district: 'Bokaro',
      preferredLanguage: 'hi',
    },
  });

  const uni1 = await prisma.user.create({
    data: {
      name: 'IIT ISM Research Team',
      email: 'iit.ism.team@gmail.com',
      passwordHash,
      role: 'UNIVERSITY',
      organizationName: 'IIT (ISM) Dhanbad',
      district: 'Dhanbad',
      preferredLanguage: 'en',
    },
  });

  const uni2 = await prisma.user.create({
    data: {
      name: 'BIT Mesra Innovation Cell',
      email: 'bit.mesra.cell@gmail.com',
      passwordHash,
      role: 'UNIVERSITY',
      organizationName: 'BIT Mesra',
      district: 'Ranchi',
      preferredLanguage: 'en',
    },
  });

  const uni3 = await prisma.user.create({
    data: {
      name: 'CNLU Legal Aid Clinic',
      email: 'cnlu.legal@gmail.com',
      passwordHash,
      role: 'UNIVERSITY',
      organizationName: 'CNLU Ranchi',
      district: 'Ranchi',
      preferredLanguage: 'en',
    },
  });

  const ind1 = await prisma.user.create({
    data: {
      name: 'Tata Steel CSR',
      email: 'tata.steel.csr@gmail.com',
      passwordHash,
      role: 'INDUSTRY',
      organizationName: 'Tata Steel Ltd',
      district: 'East Singhbhum',
      preferredLanguage: 'en',
    },
  });

  const ind2 = await prisma.user.create({
    data: {
      name: 'Usha Martin CSR',
      email: 'usha.martin@gmail.com',
      passwordHash,
      role: 'INDUSTRY',
      organizationName: 'Usha Martin Ltd',
      district: 'Ranchi',
      preferredLanguage: 'en',
    },
  });

  console.log('  ✓ Users created');

  // Create problems
  const problems = await Promise.all([
    // OPEN problems (5)
    prisma.problem.create({
      data: {
        title: 'Groundwater Depletion in Palamu District',
        description: 'Several blocks in Palamu district are facing severe groundwater depletion. The water table has dropped by over 15 feet in the last decade, affecting agriculture and drinking water supply for approximately 50,000 households. Hand pumps are drying up during summer months, forcing women and children to walk 3-5 km for clean water. We need a sustainable solution combining rainwater harvesting, watershed management, and community-level water conservation.',
        category: 'WATER_SANITATION',
        district: 'Palamu',
        urgency: 'HIGH',
        status: 'OPEN',
        submittedById: citizen2.id,
      },
    }),
    prisma.problem.create({
      data: {
        title: 'Plastic Waste Management Crisis in Dhanbad',
        description: 'Dhanbad city generates approximately 120 tonnes of plastic waste daily, but only 30% is collected and processed. Plastic waste is choking drains, contaminating soil near coal mining areas, and burning in open dumps releasing toxic fumes. The municipal corporation lacks adequate infrastructure for segregation and recycling. We need a technology-driven solution for plastic waste collection, segregation, and recycling that can be implemented at ward level.',
        category: 'ENVIRONMENT',
        district: 'Dhanbad',
        urgency: 'HIGH',
        status: 'OPEN',
        submittedById: citizen1.id,
      },
    }),
    prisma.problem.create({
      data: {
        title: 'School Dropout Tracking System for Chatra District',
        description: 'Chatra district has one of the highest school dropout rates in Jharkhand, especially among girls after Class 8. The Block Education Office lacks a real-time system to track student attendance and identify at-risk students before they drop out. Currently, dropout data is compiled manually once a year and by then it is too late for intervention. We need a simple mobile-based tracking system that teachers and ANMs can use to flag at-risk students and trigger timely counseling interventions.',
        category: 'EDUCATION',
        district: 'Chatra',
        urgency: 'MEDIUM',
        status: 'OPEN',
        submittedById: citizen3.id,
      },
    }),
    prisma.problem.create({
      data: {
        title: 'Crop Storage Losses for Small Farmers in Dumka',
        description: 'Small and marginal farmers in Dumka district lose 20-30% of their rice and maize harvest due to inadequate storage facilities. Most farmers store grain in open spaces or traditional mud structures that are vulnerable to moisture, pests, and rodents. The nearest government cold storage is 45 km away and charges are unaffordable for small farmers. We need a low-cost, scalable community-level grain storage solution that preserves grain quality and reduces post-harvest losses.',
        category: 'AGRICULTURE',
        district: 'Dumka',
        urgency: 'MEDIUM',
        status: 'OPEN',
        submittedById: citizen2.id,
      },
    }),
    prisma.problem.create({
      data: {
        title: 'Digital Skill Training Gap Among Rural Youth in Giridih',
        description: 'Over 60% of youth (18-25 years) in rural Giridih lack basic digital literacy skills, limiting their access to government schemes, online job portals, and digital financial services. Existing skill training centers are located in block headquarters and are inaccessible to youth in remote gram panchayats. We need a mobile-first, offline-capable digital literacy platform in Hindi that can be delivered through existing CSC (Common Service Centers) and village-level entrepreneurs.',
        category: 'SKILL_DEVELOPMENT',
        district: 'Giridih',
        urgency: 'MEDIUM',
        status: 'OPEN',
        submittedById: citizen3.id,
      },
    }),

    // PENDING_APPROVAL problems (3)
    prisma.problem.create({
      data: {
        title: 'Illegal Sand Mining Monitoring in Sahebganj',
        description: 'Rampant illegal sand mining along the Ganga river in Sahebganj is causing severe bank erosion, threatening agricultural land, and damaging the riverine ecosystem. Despite government orders, monitoring is manual and inadequate. A drone-based or satellite imagery monitoring system could help authorities detect and act on illegal mining activities in real-time.',
        category: 'ENVIRONMENT',
        district: 'Sahibganj',
        urgency: 'HIGH',
        status: 'PENDING_APPROVAL',
        submittedById: citizen1.id,
      },
    }),
    prisma.problem.create({
      data: {
        title: 'Maternal Health Outreach in Lohardaga Tribal Blocks',
        description: 'Pregnant women in tribal blocks of Lohardaga often miss antenatal checkups due to lack of awareness and distance to health centers. The infant mortality rate in these blocks is 45 per 1000 live births, well above the state average. ASHA workers need a simple tool to track high-risk pregnancies and coordinate with PHCs for timely referrals.',
        category: 'HEALTHCARE',
        district: 'Lohardaga',
        urgency: 'HIGH',
        status: 'PENDING_APPROVAL',
        submittedById: citizen2.id,
      },
    }),
    prisma.problem.create({
      data: {
        title: 'Road Pothole Reporting System for Hazaribagh',
        description: 'Hazaribagh roads deteriorate rapidly during monsoon season with potholes causing accidents and vehicle damage. Citizens have no easy way to report road damage and track if repairs are made. A crowdsourced reporting app with GPS tagging and photo evidence could help the PWD prioritize repairs and improve accountability.',
        category: 'INFRASTRUCTURE',
        district: 'Hazaribagh',
        urgency: 'MEDIUM',
        status: 'PENDING_APPROVAL',
        submittedById: citizen3.id,
      },
    }),

    // Problems with interests (4) — will add interests after
    prisma.problem.create({
      data: {
        title: 'Last-Mile Healthcare Access in West Singhbhum Tribal Areas',
        description: 'Remote tribal villages in West Singhbhum lack access to primary healthcare. The nearest PHC is often 25-30 km away through difficult terrain. During monsoons, many villages become completely cut off. We need a telemedicine solution combined with trained community health workers equipped with portable diagnostic kits to provide basic healthcare services in these remote areas.',
        category: 'HEALTHCARE',
        district: 'West Singhbhum',
        urgency: 'HIGH',
        status: 'OPEN',
        submittedById: citizen2.id,
      },
    }),
    prisma.problem.create({
      data: {
        title: 'Silk Weaver Market Access Platform for Saraikela',
        description: 'Traditional Tussar silk weavers in Saraikela Kharsawan district are losing their livelihoods because they cannot access wider markets. Middlemen pay them 30-40% below fair market value. Over 2,000 weaver families need a direct-to-consumer e-commerce platform that showcases their craft, handles logistics, and ensures fair pricing.',
        category: 'SKILL_DEVELOPMENT',
        district: 'Saraikela Kharsawan',
        urgency: 'MEDIUM',
        status: 'OPEN',
        submittedById: citizen1.id,
      },
    }),
    prisma.problem.create({
      data: {
        title: 'Fluoride Contamination in Drinking Water in Pakur',
        description: 'Several villages in Pakur district have fluoride levels exceeding 4 mg/L in groundwater, causing dental and skeletal fluorosis, especially among children. Current defluoridation units installed by PHE department are poorly maintained. We need a sustainable, low-cost community-managed defluoridation solution along with a water quality monitoring system.',
        category: 'WATER_SANITATION',
        district: 'Pakur',
        urgency: 'HIGH',
        status: 'OPEN',
        submittedById: citizen3.id,
      },
    }),
    prisma.problem.create({
      data: {
        title: 'Forest Fire Early Warning System for Latehar',
        description: 'Latehar district loses thousands of hectares of forest cover to fires every summer. Most fires are detected only after they spread significantly. The forest department relies on patrol teams which cannot cover the vast area effectively. A sensor-based or satellite-linked early warning system could help detect fires within minutes and coordinate rapid response.',
        category: 'ENVIRONMENT',
        district: 'Latehar',
        urgency: 'HIGH',
        status: 'OPEN',
        submittedById: citizen2.id,
      },
    }),

    // Problems with teams (TEAM_FORMED / IN_PROGRESS) (3)
    prisma.problem.create({
      data: {
        title: 'Solar-Powered Micro-Irrigation for Khunti Farmers',
        description: 'Small tribal farmers in Khunti district depend entirely on monsoon rains for irrigation. During dry spells, crops fail and farmers face severe distress. A solar-powered micro-irrigation system designed for small landholdings (1-2 acres) could transform agricultural productivity and provide a reliable water source year-round.',
        category: 'AGRICULTURE',
        district: 'Khunti',
        urgency: 'HIGH',
        status: 'TEAM_FORMED',
        submittedById: citizen2.id,
      },
    }),
    prisma.problem.create({
      data: {
        title: 'Bridge Condition Monitoring System for Koderma',
        description: 'Several bridges in Koderma district are aging and showing signs of structural stress. The PWD lacks a systematic inspection and monitoring protocol, relying on visual inspections that miss critical deterioration. An IoT-based structural health monitoring system with vibration sensors and load analysis could help prioritize maintenance and prevent catastrophic failures.',
        category: 'INFRASTRUCTURE',
        district: 'Koderma',
        urgency: 'HIGH',
        status: 'IN_PROGRESS',
        submittedById: citizen1.id,
      },
    }),
    prisma.problem.create({
      data: {
        title: 'Anemia Screening App for Anganwadi Workers in Ramgarh',
        description: 'Anemia affects 65% of children under 5 and 58% of pregnant women in Ramgarh district. Anganwadi workers currently rely on visual assessment which is highly inaccurate. A smartphone-based hemoglobin estimation tool using nail bed or conjunctiva images, combined with a referral tracking system, could dramatically improve screening coverage and follow-up treatment.',
        category: 'HEALTHCARE',
        district: 'Ramgarh',
        urgency: 'MEDIUM',
        status: 'TEAM_FORMED',
        submittedById: citizen3.id,
      },
    }),

    // PILOTED / SOLVED problems (2)
    prisma.problem.create({
      data: {
        title: 'E-Waste Collection Network for Ranchi City',
        description: 'Ranchi generates approximately 3,500 tonnes of e-waste annually but has no formal collection or recycling system. Citizens dispose of old electronics with regular waste, causing soil and water contamination. A structured e-waste collection network with scheduled pickups, drop-off points, and certified recycling was piloted successfully in 10 wards.',
        category: 'ENVIRONMENT',
        district: 'Ranchi',
        urgency: 'MEDIUM',
        status: 'PILOTED',
        submittedById: citizen1.id,
      },
    }),
    prisma.problem.create({
      data: {
        title: 'Community-Based Water Quality Testing in Deoghar',
        description: 'Drinking water sources in Deoghar were found contaminated with arsenic and iron in multiple testing rounds. A community-managed water quality testing program was established using low-cost test kits, training local youth as water quality monitors, and connecting results to a public dashboard. The program now covers 150 villages and has been adopted by the district administration as a model.',
        category: 'WATER_SANITATION',
        district: 'Deoghar',
        urgency: 'LOW',
        status: 'SOLVED',
        submittedById: citizen2.id,
      },
    }),
  ]);

  console.log('  ✓ Problems created');

  // Add status history for approved/open problems
  const openProblems = problems.filter(p => p.status !== 'PENDING_APPROVAL');
  for (const problem of openProblems) {
    await prisma.statusHistory.create({
      data: {
        problemId: problem.id,
        oldStatus: 'PENDING_APPROVAL',
        newStatus: problem.status === 'OPEN' ? 'OPEN' : 'OPEN',
        changedById: admin.id,
        note: 'Approved by admin',
      },
    });

    if (problem.status !== 'OPEN') {
      await prisma.statusHistory.create({
        data: {
          problemId: problem.id,
          oldStatus: 'OPEN',
          newStatus: problem.status,
          changedById: admin.id,
          note: `Status updated to ${problem.status.replace(/_/g, ' ')}`,
        },
      });
    }
  }

  console.log('  ✓ Status history created');

  // Create interests
  // Healthcare in West Singhbhum — interests from uni1 and ind1
  const healthcareProblem = problems[8]; // West Singhbhum healthcare
  await prisma.interest.create({
    data: {
      problemId: healthcareProblem.id,
      userId: uni1.id,
      pitchMessage: 'Our biomedical engineering department at IIT ISM has developed a portable telemedicine kit prototype. We can deploy and test it in tribal villages with our NSS volunteers serving as health workers. We have prior experience with rural health tech deployments in Jharia.',
      roleAtTime: 'UNIVERSITY',
    },
  });
  await prisma.interest.create({
    data: {
      problemId: healthcareProblem.id,
      userId: ind1.id,
      pitchMessage: 'Tata Steel CSR can provide funding for the telemedicine equipment and connectivity infrastructure. We have existing CSR operations in West Singhbhum and can leverage our community engagement network for deployment.',
      roleAtTime: 'INDUSTRY',
    },
  });

  // Silk Weaver platform — interest from uni2
  const silkProblem = problems[9]; // Saraikela silk weavers
  await prisma.interest.create({
    data: {
      problemId: silkProblem.id,
      userId: uni2.id,
      pitchMessage: 'BIT Mesra\'s Computer Science department can build the e-commerce platform. Our students have won multiple hackathons and we can deploy this as a final year project with faculty mentorship. We have contacts with NID Bengaluru for UX design support.',
      roleAtTime: 'UNIVERSITY',
    },
  });
  await prisma.interest.create({
    data: {
      problemId: silkProblem.id,
      userId: ind2.id,
      pitchMessage: 'Usha Martin can provide logistics support and initial market access through our corporate gifting channel. We can also sponsor the platform hosting costs for the first two years.',
      roleAtTime: 'INDUSTRY',
    },
  });

  // Fluoride contamination — interest from uni1
  const fluorideProblem = problems[10];
  await prisma.interest.create({
    data: {
      problemId: fluorideProblem.id,
      userId: uni1.id,
      pitchMessage: 'Our Environmental Engineering lab at IIT ISM has developed a novel activated alumina-based defluoridation filter that reduces fluoride from 5mg/L to below 1mg/L. We need field testing sites and community partners for deployment.',
      roleAtTime: 'UNIVERSITY',
    },
  });

  // Forest fire — interest from ind1
  const forestFireProblem = problems[11];
  await prisma.interest.create({
    data: {
      problemId: forestFireProblem.id,
      userId: ind1.id,
      pitchMessage: 'Tata Steel has deployed IoT sensor networks across our mining operations. We can adapt this technology for forest fire detection and provide the hardware, connectivity, and maintenance support as a CSR initiative.',
      roleAtTime: 'INDUSTRY',
    },
  });

  console.log('  ✓ Interests created');

  // Create project teams for TEAM_FORMED / IN_PROGRESS problems
  const solarProblem = problems[12]; // Solar micro-irrigation - TEAM_FORMED
  const team1 = await prisma.projectTeam.create({
    data: {
      problemId: solarProblem.id,
      members: {
        create: [
          { userId: citizen2.id },
          { userId: uni1.id },
          { userId: ind1.id },
        ],
      },
    },
  });

  const bridgeProblem = problems[13]; // Bridge monitoring - IN_PROGRESS
  const team2 = await prisma.projectTeam.create({
    data: {
      problemId: bridgeProblem.id,
      members: {
        create: [
          { userId: citizen1.id },
          { userId: uni2.id },
          { userId: ind2.id },
        ],
      },
    },
  });

  const anemiaProblem = problems[14]; // Anemia screening - TEAM_FORMED
  const team3 = await prisma.projectTeam.create({
    data: {
      problemId: anemiaProblem.id,
      members: {
        create: [
          { userId: citizen3.id },
          { userId: uni2.id },
        ],
      },
    },
  });

  console.log('  ✓ Project teams created');

  // Create team notes
  await prisma.teamNote.createMany({
    data: [
      {
        teamId: team1.id,
        authorId: uni1.id,
        authorName: 'IIT ISM Research Team',
        content: 'Completed initial site survey of 5 villages in Khunti. Identified optimal locations for solar panels based on sunlight hours and proximity to water sources. Will share detailed report next week.',
      },
      {
        teamId: team1.id,
        authorId: ind1.id,
        authorName: 'Tata Steel CSR',
        content: 'Budget approved for Phase 1 — 20 solar pump units. Procurement process initiated with 3 vendors shortlisted. Expected delivery in 6 weeks.',
      },
      {
        teamId: team2.id,
        authorId: uni2.id,
        authorName: 'BIT Mesra Innovation Cell',
        content: 'Sensor prototype v2 passed lab testing. Vibration detection accuracy improved to 94%. Planning field installation on Koderma-Hazaribagh bridge next month.',
      },
      {
        teamId: team2.id,
        authorId: ind2.id,
        authorName: 'Usha Martin CSR',
        content: 'Signed MOU with PWD Koderma for pilot installation on 3 bridges. They will provide access and historical maintenance data.',
      },
    ],
  });

  console.log('  ✓ Team notes created');

  // Create comments
  await prisma.comment.createMany({
    data: [
      {
        problemId: problems[0].id, // Groundwater Palamu
        userId: uni1.id,
        commentText: 'This is a critical issue. Our geology department has mapped the aquifer system in parts of Palamu. We can share the data if a team is formed to work on this.',
      },
      {
        problemId: problems[0].id,
        userId: citizen2.id,
        commentText: 'Thank you for offering to help. The situation in Chainpur block is especially dire — we had to bring in water tankers twice last summer.',
      },
      {
        problemId: problems[1].id, // Plastic waste Dhanbad
        userId: uni2.id,
        commentText: 'BIT Mesra students conducted a waste audit in 3 wards last semester. Happy to share the data — it shows that 40% of plastic waste is single-use packaging.',
      },
      {
        problemId: problems[1].id,
        userId: ind1.id,
        commentText: 'We have a recycling facility in Jamshedpur that could process certain types of plastic waste. Logistics would need to be worked out.',
      },
      {
        problemId: problems[8].id, // Healthcare West Singhbhum
        userId: citizen2.id,
        commentText: 'The monsoon season is approaching and connectivity becomes even worse. Any solution needs to work offline and sync when connectivity is available.',
      },
      {
        problemId: solarProblem.id, // Solar Khunti
        userId: uni1.id,
        commentText: 'We have identified 3 varieties of crops grown in the target villages that would benefit most from micro-irrigation: tomato, onion, and garlic. Planning irrigation schedules accordingly.',
      },
    ],
  });

  console.log('  ✓ Comments created');

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: citizen2.id,
        message: 'New interest expressed on "Groundwater Depletion in Palamu District"',
        link: `/problems/${problems[0].id}`,
        isRead: true,
      },
      {
        userId: citizen1.id,
        message: 'New interest expressed on "Plastic Waste Management Crisis in Dhanbad"',
        link: `/problems/${problems[1].id}`,
        isRead: false,
      },
      {
        userId: citizen2.id,
        message: 'You have been matched to a team for "Solar-Powered Micro-Irrigation for Khunti Farmers"',
        link: `/teams/${team1.id}`,
        isRead: true,
      },
      {
        userId: uni1.id,
        message: 'You have been matched to a team for "Solar-Powered Micro-Irrigation for Khunti Farmers"',
        link: `/teams/${team1.id}`,
        isRead: false,
      },
      {
        userId: ind1.id,
        message: 'You have been matched to a team for "Solar-Powered Micro-Irrigation for Khunti Farmers"',
        link: `/teams/${team1.id}`,
        isRead: false,
      },
      {
        userId: citizen1.id,
        message: 'Status of "Bridge Condition Monitoring System for Koderma" changed to IN PROGRESS',
        link: `/problems/${bridgeProblem.id}`,
        isRead: false,
      },
      {
        userId: citizen2.id,
        message: 'New comment on "Groundwater Depletion in Palamu District"',
        link: `/problems/${problems[0].id}`,
        isRead: false,
      },
    ],
  });

  console.log('  ✓ Notifications created');
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
