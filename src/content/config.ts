import { defineCollection, z } from 'astro:content';

const productosCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.number(),
    nombre: z.string(),
    descripcion: z.string(),
    precio: z.number(),
    imagen: z.string(),
    categoria: z.enum(['premium', 'tradicional', 'combo', 'especial', 'especialidad']),
    peso: z.string(),
    destacado: z.boolean().optional().default(false),
    stock: z.boolean().optional().default(true),
    slug: z.string(),

    nutricion: z.object({
      calorias: z.number(),
      proteinas: z.number(),
      grasas: z.number(),
      grasas_saturadas: z.number().optional(),
      hierro: z.number().optional(),
      sodio: z.number().optional(),
    }).optional(),

    preparacion: z.object({
      metodo: z.string(),
      tiempo: z.string(),
      temperatura: z.string(),
      tips: z.array(z.string()).optional(),
    }).optional(),

    maridajes: z.array(z.string()).optional(),
    origen: z.string().optional(),
    maduracion: z.string().optional(),
    grado: z.string().optional(),
  }),
});

export const collections = { productos: productosCollection };
