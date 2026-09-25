import { z } from 'zod';

export const parkSchema = z.enum(['L', 'S']);
export const paginationSchema = z.object({ page: z.number().int().positive(), pageSize: z.number().int().positive().max(100), total: z.number().int().nonnegative() });
export const userSchema = z.object({ userId: z.number().int(), email: z.string().email().optional(), nickname: z.string(), icon: z.string().url().nullable().optional(), socialIcon: z.string().url().nullable().optional(), url: z.string().url().nullable().optional() });
export const markerSchema = z.object({ markerId: z.number().int(), lat: z.number(), lng: z.number(), park: parkSchema, numberOfPublicArticles: z.object({ total: z.number().int(), eachCategory: z.array(z.number().int()) }) });
export const articleSchema = z.object({ postId: z.number().int(), title: z.string(), description: z.string(), marker: z.union([z.number().int(), markerSchema]), category: z.number().int().min(0).max(6), image: z.string().nullable().optional(), isDraft: z.boolean(), author: z.union([z.number().int(), userSchema]), createdAt: z.string(), updatedAt: z.string() });
export const specialMapSchema = z.object({ specialMapId: z.number().int(), author: z.union([z.number().int(), userSchema]), title: z.string(), thumbnail: z.string().nullable().optional(), isPublic: z.boolean(), description: z.string(), selectablePark: z.enum(['L', 'S', 'both']), minLatitude: z.number(), maxLatitude: z.number(), minLongitude: z.number(), maxLongitude: z.number() });
export const specialMapMarkerSchema = z.object({ specialMapMarkerId: z.number().int(), specialMap: z.number().int(), lat: z.number(), lng: z.number(), park: parkSchema, image: z.string().nullable().optional(), description: z.string(), variant: z.string() });
export type User = z.infer<typeof userSchema>;
export type Article = z.infer<typeof articleSchema>;
export type Marker = z.infer<typeof markerSchema>;
