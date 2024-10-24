import { Student } from '../../students/entities/student.entity'
import { Trainer } from '../../trainers/entities/trainer.entity'
import { User } from '../../users/entities/user.entity'
import { DataSource } from 'typeorm'
import * as bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function runSeed(AppDatasource: DataSource) {
  const dataSource: DataSource = await AppDatasource.initialize()

  // Repositorios
  const userRepository = dataSource.getRepository(User)
  const trainerRepository = dataSource.getRepository(Trainer)
  const studentRepository = dataSource.getRepository(Student)

  // Crear usuarios para entrenadores
  const trainerUsers = [
    {
      first_name: 'Pablo',
      last_name: 'Marin',
      username: 'pablo_villacres',
      email: 'pjoaquin@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'María',
      last_name: 'Sánchez',
      username: 'mariasanchez',
      email: 'maria.sanchez@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Carlos',
      last_name: 'Mendoza',
      username: 'carlosmendoza',
      email: 'carlos.mendoza@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Ana',
      last_name: 'Valencia',
      username: 'anavalencia',
      email: 'ana.valencia@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Diego',
      last_name: 'Morales',
      username: 'diegomorales',
      email: 'diego.morales@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
  ]

  const createdTrainerUsers = await userRepository.save(trainerUsers)

  // Crear usuarios para estudiantes con nombres reales
  const studentUsers = [
    {
      first_name: 'Andrea',
      last_name: 'López',
      username: 'andrealopez',
      email: 'andrea.lopez@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Juan',
      last_name: 'García',
      username: 'juan_garcia',
      email: 'juan.garcia@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Sofía',
      last_name: 'Torres',
      username: 'sofiatorres',
      email: 'sofia.torres@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Sebastián',
      last_name: 'Ruiz',
      username: 'sebastianruiz',
      email: 'sebastian.ruiz@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Valentina',
      last_name: 'Castro',
      username: 'valentinacastro',
      email: 'valentina.castro@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Daniel',
      last_name: 'Ortiz',
      username: 'danielortiz',
      email: 'daniel.ortiz@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Isabella',
      last_name: 'Flores',
      username: 'isabellaflores',
      email: 'isabella.flores@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Mateo',
      last_name: 'Rivera',
      username: 'mateorivera',
      email: 'mateo.rivera@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Camila',
      last_name: 'Herrera',
      username: 'camilaherrera',
      email: 'camila.herrera@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Santiago',
      last_name: 'Díaz',
      username: 'santiagodiaz',
      email: 'santiago.diaz@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Luciana',
      last_name: 'Pérez',
      username: 'lucianaperez',
      email: 'luciana.perez@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Emilio',
      last_name: 'Vargas',
      username: 'emiliovargas',
      email: 'emilio.vargas@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Mariana',
      last_name: 'Reyes',
      username: 'marianareyes',
      email: 'mariana.reyes@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Gabriel',
      last_name: 'Medina',
      username: 'gabrielmedina',
      email: 'gabriel.medina@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
    {
      first_name: 'Paula',
      last_name: 'Jiménez',
      username: 'paulajimenez',
      email: 'paula.jimenez@gmail.com',
      avatar_url:
        'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
      password: await hashPassword('12345'),
    },
  ]

  const createdStudentUsers = await userRepository.save(studentUsers)

  // Crear entrenadores con especializaciones reales
  const trainers = [
    {
      specialization: 'Musculación y Fitness',
      years_of_experience: 10,
      user: createdTrainerUsers[0], // Pablo Marin
    },
    {
      specialization: 'Crossfit y Entrenamiento Funcional',
      years_of_experience: 8,
      user: createdTrainerUsers[1], // María Sánchez
    },
    {
      specialization: 'Nutrición Deportiva y Acondicionamiento',
      years_of_experience: 12,
      user: createdTrainerUsers[2], // Carlos Mendoza
    },
    {
      specialization: 'Yoga y Pilates',
      years_of_experience: 7,
      user: createdTrainerUsers[3], // Ana Valencia
    },
    {
      specialization: 'Entrenamiento de Alto Rendimiento',
      years_of_experience: 9,
      user: createdTrainerUsers[4], // Diego Morales
    },
  ]

  const createdTrainers = await trainerRepository.save(trainers)

  // Crear estudiantes con datos más realistas
  const students = createdStudentUsers.map((user, index) => ({
    height: parseFloat((1.65 + Math.random() * 0.3).toFixed(2)), // Altura entre 1.65 y 1.95
    weight: parseFloat((60 + Math.random() * 30).toFixed(1)), // Peso entre 60 y 90 kg
    trained_before: Math.random() > 0.5,
    medical_conditions:
      Math.random() > 0.7
        ? 'Ninguna'
        : [
            'Asma leve',
            'Diabetes tipo 2',
            'Hipertensión controlada',
            'Lesión previa en rodilla',
            'Problemas de espalda',
          ][Math.floor(Math.random() * 5)],
    user: user,
    // Asignar los primeros 10 estudiantes al primer entrenador
    trainer:
      index < 10
        ? createdTrainers[0]
        : createdTrainers[Math.floor(Math.random() * 4) + 1],
  }))

  await studentRepository.save(students)

  console.log('Datos de prueba insertados exitosamente')
  await dataSource.destroy()
}
