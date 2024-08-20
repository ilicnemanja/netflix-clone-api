import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class SubscriptionsService {

  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  create(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const subscription = this.subscriptionRepository.create(createSubscriptionDto);
      return this.subscriptionRepository.save(subscription);
    } catch (error) {
      console.error('An unexpected error occurred:', error.message);
      throw new Error('An unexpected error occurred');
    }
  }
  
  async findAll() {
    try {
      const subscriptions = await this.subscriptionRepository.find({
        select: ['type', 'description', 'price']
      });
  
      if (!subscriptions) {
        throw new NotFoundException(`Subscriptions not found`);
      }
  
      return subscriptions;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.error('An unexpected error occurred:', error.message);
        throw new Error('An unexpected error occurred');
      }
    }
  }

  async findOne(id: number) {
    try {
      const subscription = await this.subscriptionRepository.findOne({
        where: { subscriptionId: id },
        select: ['type', 'description', 'price'],
      });
  
      if (!subscription) {
        throw new NotFoundException(`Subscription with ID ${id} not found`);
      }
  
      return subscription;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.error('An unexpected error occurred:', error.message);
        throw new Error('An unexpected error occurred');
      }
    }
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    try {
      const subscription = await this.subscriptionRepository.update(id, updateSubscriptionDto);

      console.log(subscription);

      if (subscription?.affected === 0) {
        throw new NotFoundException(`Subscription with ID ${id} not found`);
      }

      return this.findOne(id);

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.error('An unexpected error occurred:', error.message);
        throw new Error('An unexpected error occurred');
      }
    }
  }

  async remove(id: number) {
    try {
      const subscription = await this.subscriptionRepository.delete(id);

      if (subscription?.affected === 0) {
        throw new NotFoundException(`Subscription with ID ${id} not found`);
      }

      // return message
      return {
        statusCode: HttpStatus.OK,
        message: `Subscription with ID ${id} has been deleted`,
      }

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.error('An unexpected error occurred:', error.message);
        throw new Error('An unexpected error occurred');
      }
    }
  }
}
