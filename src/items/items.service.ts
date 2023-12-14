import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from '../entities/item.entity';
import { ItemStatus } from './item-status.enum';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemRepository } from './item.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: ItemRepository,
  ) {}
  private items: Item[] = [];

  findAll(): Item[] {
    return this.items;
  }

  findById(id: string): Item {
    const found = this.items.find((item) => item.id === id);
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const { name, price, description } = createItemDto;
    const item = this.itemRepository.create({
      name,
      price,
      description,
      status: ItemStatus.ON_SALE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await this.itemRepository.save(item);

    return item;
  }

  updateStatus(id: string): Item {
    const item = this.findById(id);
    item.status = ItemStatus.SOLD_OUT;
    return item;
  }

  delete(id: string): void {
    this.items = this.items.filter((item) => item.id != id);
  }
}
