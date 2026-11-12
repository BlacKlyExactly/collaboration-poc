import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../auth/http/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import {
  DOCUMENT_REPOSITORY,
  type DocumentRepository,
} from '../application/ports/document.repository';
import {
  CreateDocumentBodyDto,
  CreateDocumentResponseDto,
} from './dto/create-document.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  GetDocumentParamsDto,
  GetDocumentResponseDto,
} from './dto/get-document.dto';
import {
  GetDocumentsQueryDto,
  GetDocumentsResponseDto,
} from './dto/documents-response.dto';
import { UpdateDocumentContentBodyDto } from './dto/update-document-content.dto';

@Controller('documents')
export class DocumentController {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepo: DocumentRepository,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @ZodSerializerDto(GetDocumentsResponseDto)
  async getDocuments(@Query() input: GetDocumentsQueryDto) {
    return this.documentRepo.getDocuments(input);
  }

  @Get('/user-documents')
  @UseGuards(AuthGuard)
  @ZodSerializerDto(GetDocumentsResponseDto)
  async getCurrentUserDocuments(
    @Req() req: FastifyRequest,
    @Query() input: GetDocumentsQueryDto,
  ) {
    return this.documentRepo.getUserDocuments(req.user!.id, input);
  }

  @Get('/user-documents/:id')
  @UseGuards(AuthGuard)
  @ZodSerializerDto(GetDocumentsResponseDto)
  async getUserDocuments(
    @Query() query: GetDocumentsQueryDto,
    @Param() params: GetDocumentParamsDto,
  ) {
    return this.documentRepo.getUserDocuments(params.id, query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ZodSerializerDto(GetDocumentResponseDto)
  async getDocument(@Param() input: GetDocumentParamsDto) {
    return this.documentRepo.getDocument(input.id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ZodSerializerDto(CreateDocumentResponseDto)
  createDocument(
    @Body() dto: CreateDocumentBodyDto,
    @Req() req: FastifyRequest,
  ) {
    return this.documentRepo.createDocument(dto.name, req.user!.id);
  }

  @Patch('/update-content/:id')
  @UseGuards(AuthGuard)
  async updateDocumentContent(
    @Param() params: UpdateDocumentContentParamsDto,
    @Body() dto: UpdateDocumentContentBodyDto,
  ) {
    return this.documentRepo.updateDocumentContent(params.id, dto.newContent);
  }
}
