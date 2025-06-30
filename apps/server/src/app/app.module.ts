import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, SupabaseModule, WorkspaceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
