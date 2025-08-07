import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  const trekkingCategory = await prisma.category.create({
    data: {
      name: JSON.stringify({
        en: 'Trekking',
        ru: 'Треккинг'
      })
    }
  });

  const culturalCategory = await prisma.category.create({
    data: {
      name: JSON.stringify({
        en: 'Cultural Tours',
        ru: 'Культурные туры'
      })
    }
  });

  const adventureCategory = await prisma.category.create({
    data: {
      name: JSON.stringify({
        en: 'Adventure',
        ru: 'Приключения'
      })
    }
  });

  console.log('✅ Categories created');

  // Create sample tours
  await prisma.tour.create({
    data: {
      title: JSON.stringify({
        en: 'Pamir Mountains Trek',
        ru: 'Треккинг в горах Памир'
      }),
      description: JSON.stringify({
        en: 'Experience the breathtaking beauty of the Pamir Mountains with this challenging trek through some of Tajikistan\'s most spectacular landscapes.',
        ru: 'Испытайте захватывающую красоту Памирских гор в этом сложном треке через одни из самых впечатляющих пейзажей Таджикистана.'
      }),
      duration: '7 days',
      price: '$1,200',
      categoryId: trekkingCategory.id
    }
  });

  await prisma.tour.create({
    data: {
      title: JSON.stringify({
        en: 'Silk Road Heritage Tour',
        ru: 'Тур по наследию Шелкового пути'
      }),
      description: JSON.stringify({
        en: 'Discover the ancient Silk Road heritage of Tajikistan, visiting historic cities, markets, and cultural landmarks.',
        ru: 'Откройте для себя древнее наследие Шелкового пути Таджикистана, посетив исторические города, рынки и культурные достопримечательности.'
      }),
      duration: '5 days',
      price: '$800',
      categoryId: culturalCategory.id
    }
  });

  await prisma.tour.create({
    data: {
      title: JSON.stringify({
        en: 'Fann Mountains Adventure',
        ru: 'Приключение в Фанских горах'
      }),
      description: JSON.stringify({
        en: 'An exciting adventure through the stunning Fann Mountains, featuring pristine lakes, dramatic peaks, and alpine meadows.',
        ru: 'Захватывающее приключение через потрясающие Фанские горы с чистейшими озерами, драматичными пиками и альпийскими лугами.'
      }),
      duration: '10 days',
      price: '$1,500',
      categoryId: adventureCategory.id
    }
  });

  console.log('✅ Sample tours created');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
