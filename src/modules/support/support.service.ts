// src/modules/support/support.service.ts

import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../errors/AppError";
import {
  TCreateSupportMessage,
  TSupportMessageListQuery,
  TUpdateSupportMessageStatus,
} from "./support.validation";
import { Prisma } from "../../../generated/prisma/client";

// ─── Public: submit a message from the contact form ──────────────────────────

const createMessage = async (payload: TCreateSupportMessage) => {
  const message = await prisma.supportMessage.create({
    data: {
      name:     payload.name,
      email:    payload.email,
      subject:  payload.subject ?? null,
      category: payload.category,
      message:  payload.message,
      status:   "UNREAD",
    },
  });
  return message;
};

// ─── Admin: list messages with filters + pagination ───────────────────────────

const getMessages = async (query: TSupportMessageListQuery) => {
  const { page, limit, status, category, search } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.SupportMessageWhereInput = {
    ...(status   && { status }),
    ...(category && { category }),
    ...(search && {
      OR: [
        { name:    { contains: search, mode: "insensitive" } },
        { email:   { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [messages, total] = await Promise.all([
    prisma.supportMessage.findMany({
      where,
      orderBy: [
        { status: "asc" },   // UNREAD first (alphabetically before READ/RESOLVED)
        { createdAt: "desc" },
      ],
      skip,
      take: limit,
    }),
    prisma.supportMessage.count({ where }),
  ]);

  // Badge counts — always computed over the full table (no search/category filter)
  const [unreadCount, readCount, resolvedCount] = await Promise.all([
    prisma.supportMessage.count({ where: { status: "UNREAD" } }),
    prisma.supportMessage.count({ where: { status: "READ" } }),
    prisma.supportMessage.count({ where: { status: "RESOLVED" } }),
  ]);

  return {
    messages,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    counts: { unread: unreadCount, read: readCount, resolved: resolvedCount },
  };
};

// ─── Admin: get a single message (and mark it READ automatically) ─────────────

const getMessageById = async (id: string) => {
  const message = await prisma.supportMessage.findUnique({ where: { id } });
  if (!message) throw new NotFoundError("Support message not found.");

  // Auto-mark as READ when an admin opens it
  if (message.status === "UNREAD") {
    await prisma.supportMessage.update({
      where: { id },
      data:  { status: "READ" },
    });
    return { ...message, status: "READ" as const };
  }

  return message;
};

// ─── Admin: update status / add note ─────────────────────────────────────────

const updateMessageStatus = async (
  id: string,
  payload: TUpdateSupportMessageStatus
) => {
  const message = await prisma.supportMessage.findUnique({ where: { id } });
  if (!message) throw new NotFoundError("Support message not found.");

  const updated = await prisma.supportMessage.update({
    where: { id },
    data: {
      status: payload.status,
      ...(payload.note !== undefined && { note: payload.note }),
    },
  });

  return updated;
};

// ─── Admin: delete a message ──────────────────────────────────────────────────

const deleteMessage = async (id: string) => {
  const message = await prisma.supportMessage.findUnique({ where: { id } });
  if (!message) throw new NotFoundError("Support message not found.");
  await prisma.supportMessage.delete({ where: { id } });
};

export const SupportService = {
  createMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
};
