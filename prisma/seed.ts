import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create categories
    const categories = [
        { name: 'Serveurs VPS', displayOrder: 1 },
        { name: 'Serveurs Dédiés', displayOrder: 2 },
        { name: 'Hébergement Web', displayOrder: 3 },
        { name: 'Cloud Storage', displayOrder: 4 },
        { name: 'Sécurité', displayOrder: 5 },
        { name: 'Réseau', displayOrder: 6 },
    ];

    console.log('📁 Creating categories...');
    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: category,
        });
        console.log(`  ✓ Created category: ${category.name}`);
    }

    // Create a default banner if it doesn't exist
    console.log('🎨 Creating default banner...');
    await prisma.banner.upsert({
        where: { id: 'default-banner' },
        update: {},
        create: {
            id: 'default-banner',
            title: 'Bienvenue chez El Jarjini Complexe',
            subtitle: 'Solutions d\'hébergement professionnelles',
            imageUrl: '/banner.jpg',
            linkText: 'Découvrir nos offres',
            linkUrl: '/products',
            isActive: true,
        },
    });
    console.log('  ✓ Created default banner');

    console.log('✅ Database seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
