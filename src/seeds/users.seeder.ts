import { User } from 'src/entities';
import { Role } from 'src/constants/role.enum';
import { DataSource } from 'typeorm';
import { hashPassword } from 'src/utils/hash';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  // Check if users already exist
  const existingCount = await userRepository.count();
  if (existingCount > 0) {
    console.log('⚠️  Users already exist, skipping seed');
    return;
  }

  const users: any[] = [
    {
      email: 'admin@gmail.com',
      fullName: 'Admin User',
      password: await hashPassword('123456'),
      role: Role.ADMIN,
      isActive: true,
      isVerified: true,
    },
    {
      email: 'user@gmail.com',
      fullName: 'Regular User',
      password: await hashPassword('123456'),
      role: Role.USER,
      isActive: true,
      isVerified: true,
    },
  ];

  await userRepository.save(users);
  console.log(`✅ Seeded ${users.length} users`);
}
