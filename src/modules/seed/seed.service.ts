import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { Comment, CommentDocument } from '../comments/schemas/comment.schema';
import { Favorite, FavoriteDocument } from '../favorites/schemas/favorite.schema';
import { HashUtils } from 'src/common/utils/hashUtils';
import { Types } from 'mongoose';
import { Vote } from '../posts/types/vote.type';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>,
    private hashUtils: HashUtils,
  ) {}

  async seed() {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Limpiar base de datos
    await this.cleanDatabase();

    // Crear usuarios
    const users = await this.createUsers();
    console.log(`✅ ${users.length} usuarios creados`);

    // Crear posts
    const posts = await this.createPosts(users);
    console.log(`✅ ${posts.length} posts creados`);

    // Crear comentarios
    const comments = await this.createComments(users, posts);
    console.log(`✅ ${comments.length} comentarios creados`);

    // Crear favoritos
    await this.createFavorites(users, posts);
    console.log(`✅ Favoritos creados`);

    // Crear votos en posts
    await this.createVotes(users, posts);
    console.log(`✅ Votos creados`);

    console.log('🎉 Seed completado exitosamente!');
    console.log('\n📝 Credenciales de prueba:');
    console.log('   Email: test1@example.com | Password: password123');
    console.log('   Email: test2@example.com | Password: password123');
    console.log('   Email: test3@example.com | Password: password123');
  }

  private async cleanDatabase() {
    console.log('🧹 Limpiando base de datos...');
    await this.favoriteModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.userModel.deleteMany({});
  }

  private async createUsers(): Promise<UserDocument[]> {
    const defaultPassword = 'password123';
    const hashedPassword = await this.hashUtils.hash(defaultPassword);

    const usersData = [
      {
        first_name: 'Juan',
        last_name: 'Pérez',
        email: 'test1@example.com',
        password: hashedPassword,
        alias: 'juanperez',
        phone: '+34 600 123 456',
        address: 'Calle Mayor 1, Madrid',
        avatar_url: 'https://i.pravatar.cc/150?img=1',
        is_active: true,
      },
      {
        first_name: 'María',
        last_name: 'García',
        email: 'test2@example.com',
        password: hashedPassword,
        alias: 'mariagarcia',
        phone: '+34 600 234 567',
        address: 'Avenida Libertad 25, Barcelona',
        avatar_url: 'https://i.pravatar.cc/150?img=5',
        is_active: true,
      },
      {
        first_name: 'Carlos',
        last_name: 'López',
        email: 'test3@example.com',
        password: hashedPassword,
        alias: 'carloslopez',
        phone: '+34 600 345 678',
        address: 'Plaza España 10, Valencia',
        avatar_url: 'https://i.pravatar.cc/150?img=12',
        is_active: true,
      },
      {
        first_name: 'Ana',
        last_name: 'Martínez',
        email: 'test4@example.com',
        password: hashedPassword,
        alias: 'anamartinez',
        phone: '+34 600 456 789',
        address: 'Calle Sol 5, Sevilla',
        avatar_url: 'https://i.pravatar.cc/150?img=9',
        is_active: true,
      },
      {
        first_name: 'Luis',
        last_name: 'Rodríguez',
        email: 'test5@example.com',
        password: hashedPassword,
        alias: 'luisrodriguez',
        phone: '+34 600 567 890',
        address: 'Calle Luna 15, Bilbao',
        avatar_url: 'https://i.pravatar.cc/150?img=33',
        is_active: true,
      },
    ];

    const users = await this.userModel.insertMany(usersData);
    return users;
  }

  private async createPosts(users: UserDocument[]): Promise<PostDocument[]> {
    const postsData = [
      {
        title: 'Mi primer día en la red social',
        description: '¡Hola a todos! Acabo de unirme a esta increíble plataforma. Estoy emocionado de compartir mis experiencias con ustedes.',
        images: ['https://picsum.photos/800/600?random=1'],
        author: users[0]._id,
        votes: [],
        likes: 0,
        dislikes: 0,
        comments_count: 0,
      },
      {
        title: 'Receta de paella valenciana',
        description: 'Comparto con ustedes mi receta secreta de paella. Ingredientes: arroz, pollo, conejo, judías verdes, garrofón...',
        images: ['https://picsum.photos/800/600?random=2', 'https://picsum.photos/800/600?random=3'],
        author: users[1]._id,
        votes: [],
        likes: 0,
        dislikes: 0,
        comments_count: 0,
      },
      {
        title: 'Consejos para programadores',
        description: 'Algunos tips que me han ayudado a mejorar como desarrollador: 1) Leer código de otros, 2) Practicar regularmente, 3) No tener miedo a hacer preguntas.',
        images: [],
        author: users[2]._id,
        votes: [],
        likes: 0,
        dislikes: 0,
        comments_count: 0,
      },
      {
        title: 'Fotos de mi viaje a la playa',
        description: 'Comparto algunas fotos de mi último viaje. El mar estaba increíble y el clima perfecto.',
        images: [
          'https://picsum.photos/800/600?random=4',
          'https://picsum.photos/800/600?random=5',
          'https://picsum.photos/800/600?random=6',
        ],
        author: users[3]._id,
        votes: [],
        likes: 0,
        dislikes: 0,
        comments_count: 0,
      },
      {
        title: 'Nuevo proyecto en desarrollo',
        description: 'Estoy trabajando en un nuevo proyecto muy emocionante. Pronto compartiré más detalles con todos ustedes.',
        images: [],
        author: users[4]._id,
        votes: [],
        likes: 0,
        dislikes: 0,
        comments_count: 0,
      },
      {
        title: 'Reflexión del día',
        description: 'A veces necesitamos tomarnos un momento para reflexionar sobre nuestras vidas y las decisiones que tomamos.',
        images: [],
        author: users[0]._id,
        votes: [],
        likes: 0,
        dislikes: 0,
        comments_count: 0,
      },
      {
        title: 'Recomendación de libro',
        description: 'Acabo de terminar "El código limpio" de Robert C. Martin. ¡Altamente recomendado para desarrolladores!',
        images: ['https://picsum.photos/800/600?random=7'],
        author: users[1]._id,
        votes: [],
        likes: 0,
        dislikes: 0,
        comments_count: 0,
      },
      {
        title: 'Concierto increíble anoche',
        description: 'Anoche fui a un concierto y fue una experiencia increíble. La energía del público era contagiosa.',
        images: ['https://picsum.photos/800/600?random=8'],
        author: users[2]._id,
        votes: [],
        likes: 0,
        dislikes: 0,
        comments_count: 0,
      },
    ];

    const posts = await this.postModel.insertMany(postsData);
    return posts;
  }

  private async createComments(
    users: UserDocument[],
    posts: PostDocument[],
  ): Promise<CommentDocument[]> {
    const commentsData = [
      // Comentarios en el primer post
      {
        text: '¡Bienvenido a la plataforma! Espero que disfrutes tu experiencia aquí.',
        post: posts[0]._id,
        user: users[1]._id,
        parent: null,
        likes: [],
        likes_count: 0,
      },
      {
        text: 'Gracias por la bienvenida. Ya estoy explorando todas las funcionalidades.',
        post: posts[0]._id,
        user: users[0]._id,
        parent: null,
        likes: [],
        likes_count: 0,
      },
      {
        text: 'Si necesitas ayuda, no dudes en preguntar.',
        post: posts[0]._id,
        user: users[2]._id,
        parent: null,
        likes: [],
        likes_count: 0,
      },
      // Comentarios en el segundo post (paella)
      {
        text: '¡Qué rico! ¿Podrías compartir la receta completa?',
        post: posts[1]._id,
        user: users[2]._id,
        parent: null,
        likes: [],
        likes_count: 0,
      },
      {
        text: 'Claro, la compartiré en un post más detallado pronto.',
        post: posts[1]._id,
        user: users[1]._id,
        parent: null,
        likes: [],
        likes_count: 0,
      },
      {
        text: 'Me encanta la paella, definitivamente voy a probar esta receta.',
        post: posts[1]._id,
        user: users[3]._id,
        parent: null,
        likes: [],
        likes_count: 0,
      },
      // Comentarios en el tercer post (consejos)
      {
        text: 'Excelentes consejos. El punto 3 es especialmente importante.',
        post: posts[2]._id,
        user: users[0]._id,
        parent: null,
        likes: [],
        likes_count: 0,
      },
      {
        text: 'Totalmente de acuerdo. La práctica constante es clave.',
        post: posts[2]._id,
        user: users[4]._id,
        parent: null,
        likes: [],
        likes_count: 0,
      },
      // Respuestas a comentarios (comentarios con parent)
      {
        text: 'Gracias por el apoyo, lo aprecio mucho.',
        post: posts[0]._id,
        user: users[0]._id,
        parent: null, // Este será actualizado después
        likes: [],
        likes_count: 0,
      },
    ];

    const comments = await this.commentModel.insertMany(commentsData);

    // Crear algunas respuestas (comentarios con parent)
    const replyComments = [
      {
        text: 'De nada, estamos aquí para ayudarte.',
        post: posts[0]._id,
        user: users[1]._id,
        parent: comments[0]._id, // Respuesta al primer comentario
        likes: [],
        likes_count: 0,
      },
      {
        text: 'Perfecto, estaré atento a tu receta.',
        post: posts[1]._id,
        user: users[2]._id,
        parent: comments[3]._id, // Respuesta al comentario sobre la receta
        likes: [],
        likes_count: 0,
      },
    ];

    const replies = await this.commentModel.insertMany(replyComments);

    // Actualizar contadores de comentarios en posts
    for (const post of posts) {
      const postComments = await this.commentModel.countDocuments({
        post: post._id,
      });
      await this.postModel.updateOne(
        { _id: post._id },
        { comments_count: postComments },
      );
    }

    return [...comments, ...replies] as CommentDocument[];
  }

  private async createFavorites(
    users: UserDocument[],
    posts: PostDocument[],
  ): Promise<void> {
    const favoritesData = [
      { user: users[0]._id, post: posts[1]._id }, // Usuario 0 favorita post 1
      { user: users[0]._id, post: posts[2]._id }, // Usuario 0 favorita post 2
      { user: users[1]._id, post: posts[0]._id }, // Usuario 1 favorita post 0
      { user: users[1]._id, post: posts[3]._id }, // Usuario 1 favorita post 3
      { user: users[2]._id, post: posts[1]._id }, // Usuario 2 favorita post 1
      { user: users[2]._id, post: posts[4]._id }, // Usuario 2 favorita post 4
      { user: users[3]._id, post: posts[2]._id }, // Usuario 3 favorita post 2
      { user: users[4]._id, post: posts[0]._id }, // Usuario 4 favorita post 0
      { user: users[4]._id, post: posts[3]._id }, // Usuario 4 favorita post 3
    ];

    await this.favoriteModel.insertMany(favoritesData);
  }

  private async createVotes(
    users: UserDocument[],
    posts: PostDocument[],
  ): Promise<void> {
    // Crear algunos likes y dislikes en diferentes posts
    const votes = [
      // Post 0: varios likes
      { post: posts[0]._id, user: users[1]._id, vote: 'like' },
      { post: posts[0]._id, user: users[2]._id, vote: 'like' },
      { post: posts[0]._id, user: users[3]._id, vote: 'like' },
      // Post 1: likes y un dislike
      { post: posts[1]._id, user: users[0]._id, vote: 'like' },
      { post: posts[1]._id, user: users[2]._id, vote: 'like' },
      { post: posts[1]._id, user: users[4]._id, vote: 'dislike' },
      // Post 2: solo likes
      { post: posts[2]._id, user: users[0]._id, vote: 'like' },
      { post: posts[2]._id, user: users[1]._id, vote: 'like' },
      { post: posts[2]._id, user: users[3]._id, vote: 'like' },
      { post: posts[2]._id, user: users[4]._id, vote: 'like' },
      // Post 3: algunos likes
      { post: posts[3]._id, user: users[1]._id, vote: 'like' },
      { post: posts[3]._id, user: users[2]._id, vote: 'like' },
      // Post 4: un like
      { post: posts[4]._id, user: users[0]._id, vote: 'like' },
    ];

    // Actualizar cada post con sus votos
    for (const vote of votes) {
      const post = await this.postModel.findById(vote.post);
      if (post) {
        const voteData: Vote = {
          user: vote.user,
          vote: vote.vote as 'like' | 'dislike',
          created_at: new Date(),
        };

        post.votes.push(voteData);

        // Recalcular likes y dislikes
        post.likes = post.votes.filter((v) => v.vote === 'like').length;
        post.dislikes = post.votes.filter((v) => v.vote === 'dislike').length;

        await post.save();
      }
    }
  }
}

