import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './libro.entity';

@Injectable()
export class LibrosService implements OnModuleInit {
  constructor(@InjectRepository(Libro) private readonly repository: Repository<Libro>) {}

  async onModuleInit() {
    if (await this.repository.count() === 0) {
      await this.repository.save([
        this.repository.create({ titulo: '1984', autor: 'George Orwell', genero: 'Distopía', leido: false }),
        this.repository.create({ titulo: 'Dune', autor: 'Frank Herbert', genero: 'Ciencia ficción', leido: false }),
      ]);
    }
  }

  findAll() { return this.repository.find({ order: { titulo: 'ASC' } }); }

  async remove(id: number) {
    const libro = await this.repository.findOneBy({ id });
    if (!libro) throw new NotFoundException('Libro no encontrado');
    await this.repository.remove(libro);
  }

  async marcarLeido(id: number) {
    const libro = await this.repository.findOneBy({ id });
    if (!libro) throw new NotFoundException('Libro no encontrado');
    libro.leido = true;
    await this.repository.save(libro);
  }
}
