
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Property
 * 
 */
export type Property = $Result.DefaultSelection<Prisma.$PropertyPayload>
/**
 * Model PropertyImage
 * 
 */
export type PropertyImage = $Result.DefaultSelection<Prisma.$PropertyImagePayload>
/**
 * Model PriceHistory
 * 
 */
export type PriceHistory = $Result.DefaultSelection<Prisma.$PriceHistoryPayload>
/**
 * Model PropertyVisit
 * 
 */
export type PropertyVisit = $Result.DefaultSelection<Prisma.$PropertyVisitPayload>
/**
 * Model PropertyFavorite
 * 
 */
export type PropertyFavorite = $Result.DefaultSelection<Prisma.$PropertyFavoritePayload>
/**
 * Model PropertySettings
 * 
 */
export type PropertySettings = $Result.DefaultSelection<Prisma.$PropertySettingsPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const PropertyStatus: {
  for_sale: 'for_sale',
  for_rent: 'for_rent',
  sold: 'sold',
  rented: 'rented',
  under_contract: 'under_contract',
  withdrawn: 'withdrawn'
};

export type PropertyStatus = (typeof PropertyStatus)[keyof typeof PropertyStatus]


export const AdminStatus: {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  INACTIVE: 'INACTIVE'
};

export type AdminStatus = (typeof AdminStatus)[keyof typeof AdminStatus]


export const PropertyType: {
  apartamento: 'apartamento',
  moradia: 'moradia',
  loft: 'loft',
  penthouse: 'penthouse',
  estudio: 'estudio',
  escritorio: 'escritorio',
  terreno: 'terreno',
  loja: 'loja',
  armazem: 'armazem',
  quinta: 'quinta',
  predio: 'predio'
};

export type PropertyType = (typeof PropertyType)[keyof typeof PropertyType]


export const PropertyFeature: {
  POOL: 'POOL',
  GARAGE: 'GARAGE',
  GARDEN: 'GARDEN',
  ELEVATOR: 'ELEVATOR',
  BALCONY: 'BALCONY',
  TERRACE: 'TERRACE',
  FIREPLACE: 'FIREPLACE',
  AIR_CONDITIONING: 'AIR_CONDITIONING',
  CENTRAL_HEATING: 'CENTRAL_HEATING',
  SOLAR_PANELS: 'SOLAR_PANELS',
  FURNISHED: 'FURNISHED',
  PARKING: 'PARKING',
  SECURITY_SYSTEM: 'SECURITY_SYSTEM',
  GYM: 'GYM',
  SPA: 'SPA',
  CONCIERGE: 'CONCIERGE',
  PET_FRIENDLY: 'PET_FRIENDLY',
  OCEAN_VIEW: 'OCEAN_VIEW',
  MOUNTAIN_VIEW: 'MOUNTAIN_VIEW',
  CITY_VIEW: 'CITY_VIEW'
};

export type PropertyFeature = (typeof PropertyFeature)[keyof typeof PropertyFeature]

}

export type PropertyStatus = $Enums.PropertyStatus

export const PropertyStatus: typeof $Enums.PropertyStatus

export type AdminStatus = $Enums.AdminStatus

export const AdminStatus: typeof $Enums.AdminStatus

export type PropertyType = $Enums.PropertyType

export const PropertyType: typeof $Enums.PropertyType

export type PropertyFeature = $Enums.PropertyFeature

export const PropertyFeature: typeof $Enums.PropertyFeature

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Properties
 * const properties = await prisma.property.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Properties
   * const properties = await prisma.property.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.property`: Exposes CRUD operations for the **Property** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Properties
    * const properties = await prisma.property.findMany()
    * ```
    */
  get property(): Prisma.PropertyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.propertyImage`: Exposes CRUD operations for the **PropertyImage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PropertyImages
    * const propertyImages = await prisma.propertyImage.findMany()
    * ```
    */
  get propertyImage(): Prisma.PropertyImageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.priceHistory`: Exposes CRUD operations for the **PriceHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PriceHistories
    * const priceHistories = await prisma.priceHistory.findMany()
    * ```
    */
  get priceHistory(): Prisma.PriceHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.propertyVisit`: Exposes CRUD operations for the **PropertyVisit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PropertyVisits
    * const propertyVisits = await prisma.propertyVisit.findMany()
    * ```
    */
  get propertyVisit(): Prisma.PropertyVisitDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.propertyFavorite`: Exposes CRUD operations for the **PropertyFavorite** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PropertyFavorites
    * const propertyFavorites = await prisma.propertyFavorite.findMany()
    * ```
    */
  get propertyFavorite(): Prisma.PropertyFavoriteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.propertySettings`: Exposes CRUD operations for the **PropertySettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PropertySettings
    * const propertySettings = await prisma.propertySettings.findMany()
    * ```
    */
  get propertySettings(): Prisma.PropertySettingsDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.14.0
   * Query Engine version: 717184b7b35ea05dfa71a3236b7af656013e1e49
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Property: 'Property',
    PropertyImage: 'PropertyImage',
    PriceHistory: 'PriceHistory',
    PropertyVisit: 'PropertyVisit',
    PropertyFavorite: 'PropertyFavorite',
    PropertySettings: 'PropertySettings'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "property" | "propertyImage" | "priceHistory" | "propertyVisit" | "propertyFavorite" | "propertySettings"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Property: {
        payload: Prisma.$PropertyPayload<ExtArgs>
        fields: Prisma.PropertyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PropertyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PropertyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          findFirst: {
            args: Prisma.PropertyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PropertyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          findMany: {
            args: Prisma.PropertyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          create: {
            args: Prisma.PropertyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          createMany: {
            args: Prisma.PropertyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PropertyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          delete: {
            args: Prisma.PropertyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          update: {
            args: Prisma.PropertyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          deleteMany: {
            args: Prisma.PropertyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PropertyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PropertyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          upsert: {
            args: Prisma.PropertyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          aggregate: {
            args: Prisma.PropertyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProperty>
          }
          groupBy: {
            args: Prisma.PropertyGroupByArgs<ExtArgs>
            result: $Utils.Optional<PropertyGroupByOutputType>[]
          }
          count: {
            args: Prisma.PropertyCountArgs<ExtArgs>
            result: $Utils.Optional<PropertyCountAggregateOutputType> | number
          }
        }
      }
      PropertyImage: {
        payload: Prisma.$PropertyImagePayload<ExtArgs>
        fields: Prisma.PropertyImageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PropertyImageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyImagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PropertyImageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyImagePayload>
          }
          findFirst: {
            args: Prisma.PropertyImageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyImagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PropertyImageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyImagePayload>
          }
          findMany: {
            args: Prisma.PropertyImageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyImagePayload>[]
          }
          create: {
            args: Prisma.PropertyImageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyImagePayload>
          }
          createMany: {
            args: Prisma.PropertyImageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PropertyImageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyImagePayload>[]
          }
          delete: {
            args: Prisma.PropertyImageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyImagePayload>
          }
          update: {
            args: Prisma.PropertyImageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyImagePayload>
          }
          deleteMany: {
            args: Prisma.PropertyImageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PropertyImageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PropertyImageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyImagePayload>[]
          }
          upsert: {
            args: Prisma.PropertyImageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyImagePayload>
          }
          aggregate: {
            args: Prisma.PropertyImageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePropertyImage>
          }
          groupBy: {
            args: Prisma.PropertyImageGroupByArgs<ExtArgs>
            result: $Utils.Optional<PropertyImageGroupByOutputType>[]
          }
          count: {
            args: Prisma.PropertyImageCountArgs<ExtArgs>
            result: $Utils.Optional<PropertyImageCountAggregateOutputType> | number
          }
        }
      }
      PriceHistory: {
        payload: Prisma.$PriceHistoryPayload<ExtArgs>
        fields: Prisma.PriceHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PriceHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PriceHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>
          }
          findFirst: {
            args: Prisma.PriceHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PriceHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>
          }
          findMany: {
            args: Prisma.PriceHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>[]
          }
          create: {
            args: Prisma.PriceHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>
          }
          createMany: {
            args: Prisma.PriceHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PriceHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>[]
          }
          delete: {
            args: Prisma.PriceHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>
          }
          update: {
            args: Prisma.PriceHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>
          }
          deleteMany: {
            args: Prisma.PriceHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PriceHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PriceHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>[]
          }
          upsert: {
            args: Prisma.PriceHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceHistoryPayload>
          }
          aggregate: {
            args: Prisma.PriceHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePriceHistory>
          }
          groupBy: {
            args: Prisma.PriceHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<PriceHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.PriceHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<PriceHistoryCountAggregateOutputType> | number
          }
        }
      }
      PropertyVisit: {
        payload: Prisma.$PropertyVisitPayload<ExtArgs>
        fields: Prisma.PropertyVisitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PropertyVisitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyVisitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PropertyVisitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyVisitPayload>
          }
          findFirst: {
            args: Prisma.PropertyVisitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyVisitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PropertyVisitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyVisitPayload>
          }
          findMany: {
            args: Prisma.PropertyVisitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyVisitPayload>[]
          }
          create: {
            args: Prisma.PropertyVisitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyVisitPayload>
          }
          createMany: {
            args: Prisma.PropertyVisitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PropertyVisitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyVisitPayload>[]
          }
          delete: {
            args: Prisma.PropertyVisitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyVisitPayload>
          }
          update: {
            args: Prisma.PropertyVisitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyVisitPayload>
          }
          deleteMany: {
            args: Prisma.PropertyVisitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PropertyVisitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PropertyVisitUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyVisitPayload>[]
          }
          upsert: {
            args: Prisma.PropertyVisitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyVisitPayload>
          }
          aggregate: {
            args: Prisma.PropertyVisitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePropertyVisit>
          }
          groupBy: {
            args: Prisma.PropertyVisitGroupByArgs<ExtArgs>
            result: $Utils.Optional<PropertyVisitGroupByOutputType>[]
          }
          count: {
            args: Prisma.PropertyVisitCountArgs<ExtArgs>
            result: $Utils.Optional<PropertyVisitCountAggregateOutputType> | number
          }
        }
      }
      PropertyFavorite: {
        payload: Prisma.$PropertyFavoritePayload<ExtArgs>
        fields: Prisma.PropertyFavoriteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PropertyFavoriteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyFavoritePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PropertyFavoriteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyFavoritePayload>
          }
          findFirst: {
            args: Prisma.PropertyFavoriteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyFavoritePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PropertyFavoriteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyFavoritePayload>
          }
          findMany: {
            args: Prisma.PropertyFavoriteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyFavoritePayload>[]
          }
          create: {
            args: Prisma.PropertyFavoriteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyFavoritePayload>
          }
          createMany: {
            args: Prisma.PropertyFavoriteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PropertyFavoriteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyFavoritePayload>[]
          }
          delete: {
            args: Prisma.PropertyFavoriteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyFavoritePayload>
          }
          update: {
            args: Prisma.PropertyFavoriteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyFavoritePayload>
          }
          deleteMany: {
            args: Prisma.PropertyFavoriteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PropertyFavoriteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PropertyFavoriteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyFavoritePayload>[]
          }
          upsert: {
            args: Prisma.PropertyFavoriteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyFavoritePayload>
          }
          aggregate: {
            args: Prisma.PropertyFavoriteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePropertyFavorite>
          }
          groupBy: {
            args: Prisma.PropertyFavoriteGroupByArgs<ExtArgs>
            result: $Utils.Optional<PropertyFavoriteGroupByOutputType>[]
          }
          count: {
            args: Prisma.PropertyFavoriteCountArgs<ExtArgs>
            result: $Utils.Optional<PropertyFavoriteCountAggregateOutputType> | number
          }
        }
      }
      PropertySettings: {
        payload: Prisma.$PropertySettingsPayload<ExtArgs>
        fields: Prisma.PropertySettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PropertySettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertySettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PropertySettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertySettingsPayload>
          }
          findFirst: {
            args: Prisma.PropertySettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertySettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PropertySettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertySettingsPayload>
          }
          findMany: {
            args: Prisma.PropertySettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertySettingsPayload>[]
          }
          create: {
            args: Prisma.PropertySettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertySettingsPayload>
          }
          createMany: {
            args: Prisma.PropertySettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PropertySettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertySettingsPayload>[]
          }
          delete: {
            args: Prisma.PropertySettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertySettingsPayload>
          }
          update: {
            args: Prisma.PropertySettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertySettingsPayload>
          }
          deleteMany: {
            args: Prisma.PropertySettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PropertySettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PropertySettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertySettingsPayload>[]
          }
          upsert: {
            args: Prisma.PropertySettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertySettingsPayload>
          }
          aggregate: {
            args: Prisma.PropertySettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePropertySettings>
          }
          groupBy: {
            args: Prisma.PropertySettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<PropertySettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.PropertySettingsCountArgs<ExtArgs>
            result: $Utils.Optional<PropertySettingsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    property?: PropertyOmit
    propertyImage?: PropertyImageOmit
    priceHistory?: PriceHistoryOmit
    propertyVisit?: PropertyVisitOmit
    propertyFavorite?: PropertyFavoriteOmit
    propertySettings?: PropertySettingsOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PropertyCountOutputType
   */

  export type PropertyCountOutputType = {
    images: number
    visits: number
    favorites: number
    priceHistory: number
  }

  export type PropertyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | PropertyCountOutputTypeCountImagesArgs
    visits?: boolean | PropertyCountOutputTypeCountVisitsArgs
    favorites?: boolean | PropertyCountOutputTypeCountFavoritesArgs
    priceHistory?: boolean | PropertyCountOutputTypeCountPriceHistoryArgs
  }

  // Custom InputTypes
  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyCountOutputType
     */
    select?: PropertyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountImagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyImageWhereInput
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountVisitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyVisitWhereInput
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountFavoritesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyFavoriteWhereInput
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountPriceHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PriceHistoryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Property
   */

  export type AggregateProperty = {
    _count: PropertyCountAggregateOutputType | null
    _avg: PropertyAvgAggregateOutputType | null
    _sum: PropertySumAggregateOutputType | null
    _min: PropertyMinAggregateOutputType | null
    _max: PropertyMaxAggregateOutputType | null
  }

  export type PropertyAvgAggregateOutputType = {
    price: Decimal | null
    bedrooms: number | null
    bathrooms: number | null
    area: Decimal | null
    yearBuilt: number | null
    views: number | null
  }

  export type PropertySumAggregateOutputType = {
    price: Decimal | null
    bedrooms: number | null
    bathrooms: number | null
    area: Decimal | null
    yearBuilt: number | null
    views: number | null
  }

  export type PropertyMinAggregateOutputType = {
    id: string | null
    title: string | null
    location: string | null
    price: Decimal | null
    status: $Enums.PropertyStatus | null
    adminStatus: $Enums.AdminStatus | null
    type: $Enums.PropertyType | null
    imageUrl: string | null
    description: string | null
    bedrooms: number | null
    bathrooms: number | null
    area: Decimal | null
    yearBuilt: number | null
    garage: boolean | null
    pool: boolean | null
    energyRating: string | null
    views: number | null
    contactPhone: string | null
    contactEmail: string | null
    ownerId: string | null
    agentId: string | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PropertyMaxAggregateOutputType = {
    id: string | null
    title: string | null
    location: string | null
    price: Decimal | null
    status: $Enums.PropertyStatus | null
    adminStatus: $Enums.AdminStatus | null
    type: $Enums.PropertyType | null
    imageUrl: string | null
    description: string | null
    bedrooms: number | null
    bathrooms: number | null
    area: Decimal | null
    yearBuilt: number | null
    garage: boolean | null
    pool: boolean | null
    energyRating: string | null
    views: number | null
    contactPhone: string | null
    contactEmail: string | null
    ownerId: string | null
    agentId: string | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PropertyCountAggregateOutputType = {
    id: number
    title: number
    location: number
    price: number
    status: number
    adminStatus: number
    type: number
    imageUrl: number
    description: number
    bedrooms: number
    bathrooms: number
    area: number
    yearBuilt: number
    coordinates: number
    garage: number
    pool: number
    energyRating: number
    views: number
    features: number
    contactPhone: number
    contactEmail: number
    ownerId: number
    agentId: number
    createdBy: number
    updatedBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PropertyAvgAggregateInputType = {
    price?: true
    bedrooms?: true
    bathrooms?: true
    area?: true
    yearBuilt?: true
    views?: true
  }

  export type PropertySumAggregateInputType = {
    price?: true
    bedrooms?: true
    bathrooms?: true
    area?: true
    yearBuilt?: true
    views?: true
  }

  export type PropertyMinAggregateInputType = {
    id?: true
    title?: true
    location?: true
    price?: true
    status?: true
    adminStatus?: true
    type?: true
    imageUrl?: true
    description?: true
    bedrooms?: true
    bathrooms?: true
    area?: true
    yearBuilt?: true
    garage?: true
    pool?: true
    energyRating?: true
    views?: true
    contactPhone?: true
    contactEmail?: true
    ownerId?: true
    agentId?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PropertyMaxAggregateInputType = {
    id?: true
    title?: true
    location?: true
    price?: true
    status?: true
    adminStatus?: true
    type?: true
    imageUrl?: true
    description?: true
    bedrooms?: true
    bathrooms?: true
    area?: true
    yearBuilt?: true
    garage?: true
    pool?: true
    energyRating?: true
    views?: true
    contactPhone?: true
    contactEmail?: true
    ownerId?: true
    agentId?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PropertyCountAggregateInputType = {
    id?: true
    title?: true
    location?: true
    price?: true
    status?: true
    adminStatus?: true
    type?: true
    imageUrl?: true
    description?: true
    bedrooms?: true
    bathrooms?: true
    area?: true
    yearBuilt?: true
    coordinates?: true
    garage?: true
    pool?: true
    energyRating?: true
    views?: true
    features?: true
    contactPhone?: true
    contactEmail?: true
    ownerId?: true
    agentId?: true
    createdBy?: true
    updatedBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PropertyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Property to aggregate.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Properties
    **/
    _count?: true | PropertyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PropertyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PropertySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PropertyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PropertyMaxAggregateInputType
  }

  export type GetPropertyAggregateType<T extends PropertyAggregateArgs> = {
        [P in keyof T & keyof AggregateProperty]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProperty[P]>
      : GetScalarType<T[P], AggregateProperty[P]>
  }




  export type PropertyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyWhereInput
    orderBy?: PropertyOrderByWithAggregationInput | PropertyOrderByWithAggregationInput[]
    by: PropertyScalarFieldEnum[] | PropertyScalarFieldEnum
    having?: PropertyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PropertyCountAggregateInputType | true
    _avg?: PropertyAvgAggregateInputType
    _sum?: PropertySumAggregateInputType
    _min?: PropertyMinAggregateInputType
    _max?: PropertyMaxAggregateInputType
  }

  export type PropertyGroupByOutputType = {
    id: string
    title: string
    location: string
    price: Decimal
    status: $Enums.PropertyStatus
    adminStatus: $Enums.AdminStatus
    type: $Enums.PropertyType | null
    imageUrl: string | null
    description: string | null
    bedrooms: number | null
    bathrooms: number | null
    area: Decimal | null
    yearBuilt: number | null
    coordinates: JsonValue | null
    garage: boolean | null
    pool: boolean | null
    energyRating: string | null
    views: number
    features: string[]
    contactPhone: string | null
    contactEmail: string | null
    ownerId: string | null
    agentId: string | null
    createdBy: string | null
    updatedBy: string | null
    createdAt: Date
    updatedAt: Date
    _count: PropertyCountAggregateOutputType | null
    _avg: PropertyAvgAggregateOutputType | null
    _sum: PropertySumAggregateOutputType | null
    _min: PropertyMinAggregateOutputType | null
    _max: PropertyMaxAggregateOutputType | null
  }

  type GetPropertyGroupByPayload<T extends PropertyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PropertyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PropertyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PropertyGroupByOutputType[P]>
            : GetScalarType<T[P], PropertyGroupByOutputType[P]>
        }
      >
    >


  export type PropertySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    location?: boolean
    price?: boolean
    status?: boolean
    adminStatus?: boolean
    type?: boolean
    imageUrl?: boolean
    description?: boolean
    bedrooms?: boolean
    bathrooms?: boolean
    area?: boolean
    yearBuilt?: boolean
    coordinates?: boolean
    garage?: boolean
    pool?: boolean
    energyRating?: boolean
    views?: boolean
    features?: boolean
    contactPhone?: boolean
    contactEmail?: boolean
    ownerId?: boolean
    agentId?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    images?: boolean | Property$imagesArgs<ExtArgs>
    visits?: boolean | Property$visitsArgs<ExtArgs>
    favorites?: boolean | Property$favoritesArgs<ExtArgs>
    priceHistory?: boolean | Property$priceHistoryArgs<ExtArgs>
    _count?: boolean | PropertyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["property"]>

  export type PropertySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    location?: boolean
    price?: boolean
    status?: boolean
    adminStatus?: boolean
    type?: boolean
    imageUrl?: boolean
    description?: boolean
    bedrooms?: boolean
    bathrooms?: boolean
    area?: boolean
    yearBuilt?: boolean
    coordinates?: boolean
    garage?: boolean
    pool?: boolean
    energyRating?: boolean
    views?: boolean
    features?: boolean
    contactPhone?: boolean
    contactEmail?: boolean
    ownerId?: boolean
    agentId?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["property"]>

  export type PropertySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    location?: boolean
    price?: boolean
    status?: boolean
    adminStatus?: boolean
    type?: boolean
    imageUrl?: boolean
    description?: boolean
    bedrooms?: boolean
    bathrooms?: boolean
    area?: boolean
    yearBuilt?: boolean
    coordinates?: boolean
    garage?: boolean
    pool?: boolean
    energyRating?: boolean
    views?: boolean
    features?: boolean
    contactPhone?: boolean
    contactEmail?: boolean
    ownerId?: boolean
    agentId?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["property"]>

  export type PropertySelectScalar = {
    id?: boolean
    title?: boolean
    location?: boolean
    price?: boolean
    status?: boolean
    adminStatus?: boolean
    type?: boolean
    imageUrl?: boolean
    description?: boolean
    bedrooms?: boolean
    bathrooms?: boolean
    area?: boolean
    yearBuilt?: boolean
    coordinates?: boolean
    garage?: boolean
    pool?: boolean
    energyRating?: boolean
    views?: boolean
    features?: boolean
    contactPhone?: boolean
    contactEmail?: boolean
    ownerId?: boolean
    agentId?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PropertyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "location" | "price" | "status" | "adminStatus" | "type" | "imageUrl" | "description" | "bedrooms" | "bathrooms" | "area" | "yearBuilt" | "coordinates" | "garage" | "pool" | "energyRating" | "views" | "features" | "contactPhone" | "contactEmail" | "ownerId" | "agentId" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt", ExtArgs["result"]["property"]>
  export type PropertyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | Property$imagesArgs<ExtArgs>
    visits?: boolean | Property$visitsArgs<ExtArgs>
    favorites?: boolean | Property$favoritesArgs<ExtArgs>
    priceHistory?: boolean | Property$priceHistoryArgs<ExtArgs>
    _count?: boolean | PropertyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PropertyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PropertyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PropertyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Property"
    objects: {
      images: Prisma.$PropertyImagePayload<ExtArgs>[]
      visits: Prisma.$PropertyVisitPayload<ExtArgs>[]
      favorites: Prisma.$PropertyFavoritePayload<ExtArgs>[]
      priceHistory: Prisma.$PriceHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      location: string
      price: Prisma.Decimal
      status: $Enums.PropertyStatus
      adminStatus: $Enums.AdminStatus
      type: $Enums.PropertyType | null
      imageUrl: string | null
      description: string | null
      bedrooms: number | null
      bathrooms: number | null
      area: Prisma.Decimal | null
      yearBuilt: number | null
      coordinates: Prisma.JsonValue | null
      garage: boolean | null
      pool: boolean | null
      energyRating: string | null
      views: number
      features: string[]
      contactPhone: string | null
      contactEmail: string | null
      ownerId: string | null
      agentId: string | null
      createdBy: string | null
      updatedBy: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["property"]>
    composites: {}
  }

  type PropertyGetPayload<S extends boolean | null | undefined | PropertyDefaultArgs> = $Result.GetResult<Prisma.$PropertyPayload, S>

  type PropertyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PropertyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PropertyCountAggregateInputType | true
    }

  export interface PropertyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Property'], meta: { name: 'Property' } }
    /**
     * Find zero or one Property that matches the filter.
     * @param {PropertyFindUniqueArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PropertyFindUniqueArgs>(args: SelectSubset<T, PropertyFindUniqueArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Property that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PropertyFindUniqueOrThrowArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PropertyFindUniqueOrThrowArgs>(args: SelectSubset<T, PropertyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Property that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindFirstArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PropertyFindFirstArgs>(args?: SelectSubset<T, PropertyFindFirstArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Property that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindFirstOrThrowArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PropertyFindFirstOrThrowArgs>(args?: SelectSubset<T, PropertyFindFirstOrThrowArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Properties that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Properties
     * const properties = await prisma.property.findMany()
     * 
     * // Get first 10 Properties
     * const properties = await prisma.property.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const propertyWithIdOnly = await prisma.property.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PropertyFindManyArgs>(args?: SelectSubset<T, PropertyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Property.
     * @param {PropertyCreateArgs} args - Arguments to create a Property.
     * @example
     * // Create one Property
     * const Property = await prisma.property.create({
     *   data: {
     *     // ... data to create a Property
     *   }
     * })
     * 
     */
    create<T extends PropertyCreateArgs>(args: SelectSubset<T, PropertyCreateArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Properties.
     * @param {PropertyCreateManyArgs} args - Arguments to create many Properties.
     * @example
     * // Create many Properties
     * const property = await prisma.property.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PropertyCreateManyArgs>(args?: SelectSubset<T, PropertyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Properties and returns the data saved in the database.
     * @param {PropertyCreateManyAndReturnArgs} args - Arguments to create many Properties.
     * @example
     * // Create many Properties
     * const property = await prisma.property.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Properties and only return the `id`
     * const propertyWithIdOnly = await prisma.property.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PropertyCreateManyAndReturnArgs>(args?: SelectSubset<T, PropertyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Property.
     * @param {PropertyDeleteArgs} args - Arguments to delete one Property.
     * @example
     * // Delete one Property
     * const Property = await prisma.property.delete({
     *   where: {
     *     // ... filter to delete one Property
     *   }
     * })
     * 
     */
    delete<T extends PropertyDeleteArgs>(args: SelectSubset<T, PropertyDeleteArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Property.
     * @param {PropertyUpdateArgs} args - Arguments to update one Property.
     * @example
     * // Update one Property
     * const property = await prisma.property.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PropertyUpdateArgs>(args: SelectSubset<T, PropertyUpdateArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Properties.
     * @param {PropertyDeleteManyArgs} args - Arguments to filter Properties to delete.
     * @example
     * // Delete a few Properties
     * const { count } = await prisma.property.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PropertyDeleteManyArgs>(args?: SelectSubset<T, PropertyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Properties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Properties
     * const property = await prisma.property.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PropertyUpdateManyArgs>(args: SelectSubset<T, PropertyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Properties and returns the data updated in the database.
     * @param {PropertyUpdateManyAndReturnArgs} args - Arguments to update many Properties.
     * @example
     * // Update many Properties
     * const property = await prisma.property.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Properties and only return the `id`
     * const propertyWithIdOnly = await prisma.property.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PropertyUpdateManyAndReturnArgs>(args: SelectSubset<T, PropertyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Property.
     * @param {PropertyUpsertArgs} args - Arguments to update or create a Property.
     * @example
     * // Update or create a Property
     * const property = await prisma.property.upsert({
     *   create: {
     *     // ... data to create a Property
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Property we want to update
     *   }
     * })
     */
    upsert<T extends PropertyUpsertArgs>(args: SelectSubset<T, PropertyUpsertArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Properties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyCountArgs} args - Arguments to filter Properties to count.
     * @example
     * // Count the number of Properties
     * const count = await prisma.property.count({
     *   where: {
     *     // ... the filter for the Properties we want to count
     *   }
     * })
    **/
    count<T extends PropertyCountArgs>(
      args?: Subset<T, PropertyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PropertyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Property.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PropertyAggregateArgs>(args: Subset<T, PropertyAggregateArgs>): Prisma.PrismaPromise<GetPropertyAggregateType<T>>

    /**
     * Group by Property.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PropertyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PropertyGroupByArgs['orderBy'] }
        : { orderBy?: PropertyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PropertyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPropertyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Property model
   */
  readonly fields: PropertyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Property.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PropertyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    images<T extends Property$imagesArgs<ExtArgs> = {}>(args?: Subset<T, Property$imagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    visits<T extends Property$visitsArgs<ExtArgs> = {}>(args?: Subset<T, Property$visitsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyVisitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    favorites<T extends Property$favoritesArgs<ExtArgs> = {}>(args?: Subset<T, Property$favoritesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyFavoritePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    priceHistory<T extends Property$priceHistoryArgs<ExtArgs> = {}>(args?: Subset<T, Property$priceHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Property model
   */
  interface PropertyFieldRefs {
    readonly id: FieldRef<"Property", 'String'>
    readonly title: FieldRef<"Property", 'String'>
    readonly location: FieldRef<"Property", 'String'>
    readonly price: FieldRef<"Property", 'Decimal'>
    readonly status: FieldRef<"Property", 'PropertyStatus'>
    readonly adminStatus: FieldRef<"Property", 'AdminStatus'>
    readonly type: FieldRef<"Property", 'PropertyType'>
    readonly imageUrl: FieldRef<"Property", 'String'>
    readonly description: FieldRef<"Property", 'String'>
    readonly bedrooms: FieldRef<"Property", 'Int'>
    readonly bathrooms: FieldRef<"Property", 'Int'>
    readonly area: FieldRef<"Property", 'Decimal'>
    readonly yearBuilt: FieldRef<"Property", 'Int'>
    readonly coordinates: FieldRef<"Property", 'Json'>
    readonly garage: FieldRef<"Property", 'Boolean'>
    readonly pool: FieldRef<"Property", 'Boolean'>
    readonly energyRating: FieldRef<"Property", 'String'>
    readonly views: FieldRef<"Property", 'Int'>
    readonly features: FieldRef<"Property", 'String[]'>
    readonly contactPhone: FieldRef<"Property", 'String'>
    readonly contactEmail: FieldRef<"Property", 'String'>
    readonly ownerId: FieldRef<"Property", 'String'>
    readonly agentId: FieldRef<"Property", 'String'>
    readonly createdBy: FieldRef<"Property", 'String'>
    readonly updatedBy: FieldRef<"Property", 'String'>
    readonly createdAt: FieldRef<"Property", 'DateTime'>
    readonly updatedAt: FieldRef<"Property", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Property findUnique
   */
  export type PropertyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property findUniqueOrThrow
   */
  export type PropertyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property findFirst
   */
  export type PropertyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Properties.
     */
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property findFirstOrThrow
   */
  export type PropertyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Properties.
     */
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property findMany
   */
  export type PropertyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Properties to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property create
   */
  export type PropertyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The data needed to create a Property.
     */
    data: XOR<PropertyCreateInput, PropertyUncheckedCreateInput>
  }

  /**
   * Property createMany
   */
  export type PropertyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Properties.
     */
    data: PropertyCreateManyInput | PropertyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Property createManyAndReturn
   */
  export type PropertyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * The data used to create many Properties.
     */
    data: PropertyCreateManyInput | PropertyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Property update
   */
  export type PropertyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The data needed to update a Property.
     */
    data: XOR<PropertyUpdateInput, PropertyUncheckedUpdateInput>
    /**
     * Choose, which Property to update.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property updateMany
   */
  export type PropertyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Properties.
     */
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyInput>
    /**
     * Filter which Properties to update
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to update.
     */
    limit?: number
  }

  /**
   * Property updateManyAndReturn
   */
  export type PropertyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * The data used to update Properties.
     */
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyInput>
    /**
     * Filter which Properties to update
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to update.
     */
    limit?: number
  }

  /**
   * Property upsert
   */
  export type PropertyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The filter to search for the Property to update in case it exists.
     */
    where: PropertyWhereUniqueInput
    /**
     * In case the Property found by the `where` argument doesn't exist, create a new Property with this data.
     */
    create: XOR<PropertyCreateInput, PropertyUncheckedCreateInput>
    /**
     * In case the Property was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PropertyUpdateInput, PropertyUncheckedUpdateInput>
  }

  /**
   * Property delete
   */
  export type PropertyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter which Property to delete.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property deleteMany
   */
  export type PropertyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Properties to delete
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to delete.
     */
    limit?: number
  }

  /**
   * Property.images
   */
  export type Property$imagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyImage
     */
    select?: PropertyImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyImage
     */
    omit?: PropertyImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyImageInclude<ExtArgs> | null
    where?: PropertyImageWhereInput
    orderBy?: PropertyImageOrderByWithRelationInput | PropertyImageOrderByWithRelationInput[]
    cursor?: PropertyImageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PropertyImageScalarFieldEnum | PropertyImageScalarFieldEnum[]
  }

  /**
   * Property.visits
   */
  export type Property$visitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyVisit
     */
    select?: PropertyVisitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyVisit
     */
    omit?: PropertyVisitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyVisitInclude<ExtArgs> | null
    where?: PropertyVisitWhereInput
    orderBy?: PropertyVisitOrderByWithRelationInput | PropertyVisitOrderByWithRelationInput[]
    cursor?: PropertyVisitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PropertyVisitScalarFieldEnum | PropertyVisitScalarFieldEnum[]
  }

  /**
   * Property.favorites
   */
  export type Property$favoritesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyFavorite
     */
    select?: PropertyFavoriteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyFavorite
     */
    omit?: PropertyFavoriteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyFavoriteInclude<ExtArgs> | null
    where?: PropertyFavoriteWhereInput
    orderBy?: PropertyFavoriteOrderByWithRelationInput | PropertyFavoriteOrderByWithRelationInput[]
    cursor?: PropertyFavoriteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PropertyFavoriteScalarFieldEnum | PropertyFavoriteScalarFieldEnum[]
  }

  /**
   * Property.priceHistory
   */
  export type Property$priceHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    where?: PriceHistoryWhereInput
    orderBy?: PriceHistoryOrderByWithRelationInput | PriceHistoryOrderByWithRelationInput[]
    cursor?: PriceHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PriceHistoryScalarFieldEnum | PriceHistoryScalarFieldEnum[]
  }

  /**
   * Property without action
   */
  export type PropertyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
  }


  /**
   * Model PropertyImage
   */

  export type AggregatePropertyImage = {
    _count: PropertyImageCountAggregateOutputType | null
    _avg: PropertyImageAvgAggregateOutputType | null
    _sum: PropertyImageSumAggregateOutputType | null
    _min: PropertyImageMinAggregateOutputType | null
    _max: PropertyImageMaxAggregateOutputType | null
  }

  export type PropertyImageAvgAggregateOutputType = {
    order: number | null
  }

  export type PropertyImageSumAggregateOutputType = {
    order: number | null
  }

  export type PropertyImageMinAggregateOutputType = {
    id: string | null
    propertyId: string | null
    url: string | null
    alt: string | null
    order: number | null
    createdAt: Date | null
  }

  export type PropertyImageMaxAggregateOutputType = {
    id: string | null
    propertyId: string | null
    url: string | null
    alt: string | null
    order: number | null
    createdAt: Date | null
  }

  export type PropertyImageCountAggregateOutputType = {
    id: number
    propertyId: number
    url: number
    alt: number
    order: number
    createdAt: number
    _all: number
  }


  export type PropertyImageAvgAggregateInputType = {
    order?: true
  }

  export type PropertyImageSumAggregateInputType = {
    order?: true
  }

  export type PropertyImageMinAggregateInputType = {
    id?: true
    propertyId?: true
    url?: true
    alt?: true
    order?: true
    createdAt?: true
  }

  export type PropertyImageMaxAggregateInputType = {
    id?: true
    propertyId?: true
    url?: true
    alt?: true
    order?: true
    createdAt?: true
  }

  export type PropertyImageCountAggregateInputType = {
    id?: true
    propertyId?: true
    url?: true
    alt?: true
    order?: true
    createdAt?: true
    _all?: true
  }

  export type PropertyImageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PropertyImage to aggregate.
     */
    where?: PropertyImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertyImages to fetch.
     */
    orderBy?: PropertyImageOrderByWithRelationInput | PropertyImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PropertyImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertyImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertyImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PropertyImages
    **/
    _count?: true | PropertyImageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PropertyImageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PropertyImageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PropertyImageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PropertyImageMaxAggregateInputType
  }

  export type GetPropertyImageAggregateType<T extends PropertyImageAggregateArgs> = {
        [P in keyof T & keyof AggregatePropertyImage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePropertyImage[P]>
      : GetScalarType<T[P], AggregatePropertyImage[P]>
  }




  export type PropertyImageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyImageWhereInput
    orderBy?: PropertyImageOrderByWithAggregationInput | PropertyImageOrderByWithAggregationInput[]
    by: PropertyImageScalarFieldEnum[] | PropertyImageScalarFieldEnum
    having?: PropertyImageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PropertyImageCountAggregateInputType | true
    _avg?: PropertyImageAvgAggregateInputType
    _sum?: PropertyImageSumAggregateInputType
    _min?: PropertyImageMinAggregateInputType
    _max?: PropertyImageMaxAggregateInputType
  }

  export type PropertyImageGroupByOutputType = {
    id: string
    propertyId: string
    url: string
    alt: string | null
    order: number
    createdAt: Date
    _count: PropertyImageCountAggregateOutputType | null
    _avg: PropertyImageAvgAggregateOutputType | null
    _sum: PropertyImageSumAggregateOutputType | null
    _min: PropertyImageMinAggregateOutputType | null
    _max: PropertyImageMaxAggregateOutputType | null
  }

  type GetPropertyImageGroupByPayload<T extends PropertyImageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PropertyImageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PropertyImageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PropertyImageGroupByOutputType[P]>
            : GetScalarType<T[P], PropertyImageGroupByOutputType[P]>
        }
      >
    >


  export type PropertyImageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    url?: boolean
    alt?: boolean
    order?: boolean
    createdAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["propertyImage"]>

  export type PropertyImageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    url?: boolean
    alt?: boolean
    order?: boolean
    createdAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["propertyImage"]>

  export type PropertyImageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    url?: boolean
    alt?: boolean
    order?: boolean
    createdAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["propertyImage"]>

  export type PropertyImageSelectScalar = {
    id?: boolean
    propertyId?: boolean
    url?: boolean
    alt?: boolean
    order?: boolean
    createdAt?: boolean
  }

  export type PropertyImageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "propertyId" | "url" | "alt" | "order" | "createdAt", ExtArgs["result"]["propertyImage"]>
  export type PropertyImageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }
  export type PropertyImageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }
  export type PropertyImageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }

  export type $PropertyImagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PropertyImage"
    objects: {
      property: Prisma.$PropertyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      propertyId: string
      url: string
      alt: string | null
      order: number
      createdAt: Date
    }, ExtArgs["result"]["propertyImage"]>
    composites: {}
  }

  type PropertyImageGetPayload<S extends boolean | null | undefined | PropertyImageDefaultArgs> = $Result.GetResult<Prisma.$PropertyImagePayload, S>

  type PropertyImageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PropertyImageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PropertyImageCountAggregateInputType | true
    }

  export interface PropertyImageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PropertyImage'], meta: { name: 'PropertyImage' } }
    /**
     * Find zero or one PropertyImage that matches the filter.
     * @param {PropertyImageFindUniqueArgs} args - Arguments to find a PropertyImage
     * @example
     * // Get one PropertyImage
     * const propertyImage = await prisma.propertyImage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PropertyImageFindUniqueArgs>(args: SelectSubset<T, PropertyImageFindUniqueArgs<ExtArgs>>): Prisma__PropertyImageClient<$Result.GetResult<Prisma.$PropertyImagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PropertyImage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PropertyImageFindUniqueOrThrowArgs} args - Arguments to find a PropertyImage
     * @example
     * // Get one PropertyImage
     * const propertyImage = await prisma.propertyImage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PropertyImageFindUniqueOrThrowArgs>(args: SelectSubset<T, PropertyImageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PropertyImageClient<$Result.GetResult<Prisma.$PropertyImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PropertyImage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyImageFindFirstArgs} args - Arguments to find a PropertyImage
     * @example
     * // Get one PropertyImage
     * const propertyImage = await prisma.propertyImage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PropertyImageFindFirstArgs>(args?: SelectSubset<T, PropertyImageFindFirstArgs<ExtArgs>>): Prisma__PropertyImageClient<$Result.GetResult<Prisma.$PropertyImagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PropertyImage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyImageFindFirstOrThrowArgs} args - Arguments to find a PropertyImage
     * @example
     * // Get one PropertyImage
     * const propertyImage = await prisma.propertyImage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PropertyImageFindFirstOrThrowArgs>(args?: SelectSubset<T, PropertyImageFindFirstOrThrowArgs<ExtArgs>>): Prisma__PropertyImageClient<$Result.GetResult<Prisma.$PropertyImagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PropertyImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyImageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PropertyImages
     * const propertyImages = await prisma.propertyImage.findMany()
     * 
     * // Get first 10 PropertyImages
     * const propertyImages = await prisma.propertyImage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const propertyImageWithIdOnly = await prisma.propertyImage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PropertyImageFindManyArgs>(args?: SelectSubset<T, PropertyImageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PropertyImage.
     * @param {PropertyImageCreateArgs} args - Arguments to create a PropertyImage.
     * @example
     * // Create one PropertyImage
     * const PropertyImage = await prisma.propertyImage.create({
     *   data: {
     *     // ... data to create a PropertyImage
     *   }
     * })
     * 
     */
    create<T extends PropertyImageCreateArgs>(args: SelectSubset<T, PropertyImageCreateArgs<ExtArgs>>): Prisma__PropertyImageClient<$Result.GetResult<Prisma.$PropertyImagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PropertyImages.
     * @param {PropertyImageCreateManyArgs} args - Arguments to create many PropertyImages.
     * @example
     * // Create many PropertyImages
     * const propertyImage = await prisma.propertyImage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PropertyImageCreateManyArgs>(args?: SelectSubset<T, PropertyImageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PropertyImages and returns the data saved in the database.
     * @param {PropertyImageCreateManyAndReturnArgs} args - Arguments to create many PropertyImages.
     * @example
     * // Create many PropertyImages
     * const propertyImage = await prisma.propertyImage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PropertyImages and only return the `id`
     * const propertyImageWithIdOnly = await prisma.propertyImage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PropertyImageCreateManyAndReturnArgs>(args?: SelectSubset<T, PropertyImageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyImagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PropertyImage.
     * @param {PropertyImageDeleteArgs} args - Arguments to delete one PropertyImage.
     * @example
     * // Delete one PropertyImage
     * const PropertyImage = await prisma.propertyImage.delete({
     *   where: {
     *     // ... filter to delete one PropertyImage
     *   }
     * })
     * 
     */
    delete<T extends PropertyImageDeleteArgs>(args: SelectSubset<T, PropertyImageDeleteArgs<ExtArgs>>): Prisma__PropertyImageClient<$Result.GetResult<Prisma.$PropertyImagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PropertyImage.
     * @param {PropertyImageUpdateArgs} args - Arguments to update one PropertyImage.
     * @example
     * // Update one PropertyImage
     * const propertyImage = await prisma.propertyImage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PropertyImageUpdateArgs>(args: SelectSubset<T, PropertyImageUpdateArgs<ExtArgs>>): Prisma__PropertyImageClient<$Result.GetResult<Prisma.$PropertyImagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PropertyImages.
     * @param {PropertyImageDeleteManyArgs} args - Arguments to filter PropertyImages to delete.
     * @example
     * // Delete a few PropertyImages
     * const { count } = await prisma.propertyImage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PropertyImageDeleteManyArgs>(args?: SelectSubset<T, PropertyImageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PropertyImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyImageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PropertyImages
     * const propertyImage = await prisma.propertyImage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PropertyImageUpdateManyArgs>(args: SelectSubset<T, PropertyImageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PropertyImages and returns the data updated in the database.
     * @param {PropertyImageUpdateManyAndReturnArgs} args - Arguments to update many PropertyImages.
     * @example
     * // Update many PropertyImages
     * const propertyImage = await prisma.propertyImage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PropertyImages and only return the `id`
     * const propertyImageWithIdOnly = await prisma.propertyImage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PropertyImageUpdateManyAndReturnArgs>(args: SelectSubset<T, PropertyImageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyImagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PropertyImage.
     * @param {PropertyImageUpsertArgs} args - Arguments to update or create a PropertyImage.
     * @example
     * // Update or create a PropertyImage
     * const propertyImage = await prisma.propertyImage.upsert({
     *   create: {
     *     // ... data to create a PropertyImage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PropertyImage we want to update
     *   }
     * })
     */
    upsert<T extends PropertyImageUpsertArgs>(args: SelectSubset<T, PropertyImageUpsertArgs<ExtArgs>>): Prisma__PropertyImageClient<$Result.GetResult<Prisma.$PropertyImagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PropertyImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyImageCountArgs} args - Arguments to filter PropertyImages to count.
     * @example
     * // Count the number of PropertyImages
     * const count = await prisma.propertyImage.count({
     *   where: {
     *     // ... the filter for the PropertyImages we want to count
     *   }
     * })
    **/
    count<T extends PropertyImageCountArgs>(
      args?: Subset<T, PropertyImageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PropertyImageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PropertyImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyImageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PropertyImageAggregateArgs>(args: Subset<T, PropertyImageAggregateArgs>): Prisma.PrismaPromise<GetPropertyImageAggregateType<T>>

    /**
     * Group by PropertyImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyImageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PropertyImageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PropertyImageGroupByArgs['orderBy'] }
        : { orderBy?: PropertyImageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PropertyImageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPropertyImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PropertyImage model
   */
  readonly fields: PropertyImageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PropertyImage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PropertyImageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PropertyImage model
   */
  interface PropertyImageFieldRefs {
    readonly id: FieldRef<"PropertyImage", 'String'>
    readonly propertyId: FieldRef<"PropertyImage", 'String'>
    readonly url: FieldRef<"PropertyImage", 'String'>
    readonly alt: FieldRef<"PropertyImage", 'String'>
    readonly order: FieldRef<"PropertyImage", 'Int'>
    readonly createdAt: FieldRef<"PropertyImage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PropertyImage findUnique
   */
  export type PropertyImageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyImage
     */
    select?: PropertyImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyImage
     */
    omit?: PropertyImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyImageInclude<ExtArgs> | null
    /**
     * Filter, which PropertyImage to fetch.
     */
    where: PropertyImageWhereUniqueInput
  }

  /**
   * PropertyImage findUniqueOrThrow
   */
  export type PropertyImageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyImage
     */
    select?: PropertyImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyImage
     */
    omit?: PropertyImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyImageInclude<ExtArgs> | null
    /**
     * Filter, which PropertyImage to fetch.
     */
    where: PropertyImageWhereUniqueInput
  }

  /**
   * PropertyImage findFirst
   */
  export type PropertyImageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyImage
     */
    select?: PropertyImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyImage
     */
    omit?: PropertyImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyImageInclude<ExtArgs> | null
    /**
     * Filter, which PropertyImage to fetch.
     */
    where?: PropertyImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertyImages to fetch.
     */
    orderBy?: PropertyImageOrderByWithRelationInput | PropertyImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PropertyImages.
     */
    cursor?: PropertyImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertyImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertyImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PropertyImages.
     */
    distinct?: PropertyImageScalarFieldEnum | PropertyImageScalarFieldEnum[]
  }

  /**
   * PropertyImage findFirstOrThrow
   */
  export type PropertyImageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyImage
     */
    select?: PropertyImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyImage
     */
    omit?: PropertyImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyImageInclude<ExtArgs> | null
    /**
     * Filter, which PropertyImage to fetch.
     */
    where?: PropertyImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertyImages to fetch.
     */
    orderBy?: PropertyImageOrderByWithRelationInput | PropertyImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PropertyImages.
     */
    cursor?: PropertyImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertyImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertyImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PropertyImages.
     */
    distinct?: PropertyImageScalarFieldEnum | PropertyImageScalarFieldEnum[]
  }

  /**
   * PropertyImage findMany
   */
  export type PropertyImageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyImage
     */
    select?: PropertyImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyImage
     */
    omit?: PropertyImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyImageInclude<ExtArgs> | null
    /**
     * Filter, which PropertyImages to fetch.
     */
    where?: PropertyImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertyImages to fetch.
     */
    orderBy?: PropertyImageOrderByWithRelationInput | PropertyImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PropertyImages.
     */
    cursor?: PropertyImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertyImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertyImages.
     */
    skip?: number
    distinct?: PropertyImageScalarFieldEnum | PropertyImageScalarFieldEnum[]
  }

  /**
   * PropertyImage create
   */
  export type PropertyImageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyImage
     */
    select?: PropertyImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyImage
     */
    omit?: PropertyImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyImageInclude<ExtArgs> | null
    /**
     * The data needed to create a PropertyImage.
     */
    data: XOR<PropertyImageCreateInput, PropertyImageUncheckedCreateInput>
  }

  /**
   * PropertyImage createMany
   */
  export type PropertyImageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PropertyImages.
     */
    data: PropertyImageCreateManyInput | PropertyImageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PropertyImage createManyAndReturn
   */
  export type PropertyImageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyImage
     */
    select?: PropertyImageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyImage
     */
    omit?: PropertyImageOmit<ExtArgs> | null
    /**
     * The data used to create many PropertyImages.
     */
    data: PropertyImageCreateManyInput | PropertyImageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyImageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PropertyImage update
   */
  export type PropertyImageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyImage
     */
    select?: PropertyImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyImage
     */
    omit?: PropertyImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyImageInclude<ExtArgs> | null
    /**
     * The data needed to update a PropertyImage.
     */
    data: XOR<PropertyImageUpdateInput, PropertyImageUncheckedUpdateInput>
    /**
     * Choose, which PropertyImage to update.
     */
    where: PropertyImageWhereUniqueInput
  }

  /**
   * PropertyImage updateMany
   */
  export type PropertyImageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PropertyImages.
     */
    data: XOR<PropertyImageUpdateManyMutationInput, PropertyImageUncheckedUpdateManyInput>
    /**
     * Filter which PropertyImages to update
     */
    where?: PropertyImageWhereInput
    /**
     * Limit how many PropertyImages to update.
     */
    limit?: number
  }

  /**
   * PropertyImage updateManyAndReturn
   */
  export type PropertyImageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyImage
     */
    select?: PropertyImageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyImage
     */
    omit?: PropertyImageOmit<ExtArgs> | null
    /**
     * The data used to update PropertyImages.
     */
    data: XOR<PropertyImageUpdateManyMutationInput, PropertyImageUncheckedUpdateManyInput>
    /**
     * Filter which PropertyImages to update
     */
    where?: PropertyImageWhereInput
    /**
     * Limit how many PropertyImages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyImageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PropertyImage upsert
   */
  export type PropertyImageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyImage
     */
    select?: PropertyImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyImage
     */
    omit?: PropertyImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyImageInclude<ExtArgs> | null
    /**
     * The filter to search for the PropertyImage to update in case it exists.
     */
    where: PropertyImageWhereUniqueInput
    /**
     * In case the PropertyImage found by the `where` argument doesn't exist, create a new PropertyImage with this data.
     */
    create: XOR<PropertyImageCreateInput, PropertyImageUncheckedCreateInput>
    /**
     * In case the PropertyImage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PropertyImageUpdateInput, PropertyImageUncheckedUpdateInput>
  }

  /**
   * PropertyImage delete
   */
  export type PropertyImageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyImage
     */
    select?: PropertyImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyImage
     */
    omit?: PropertyImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyImageInclude<ExtArgs> | null
    /**
     * Filter which PropertyImage to delete.
     */
    where: PropertyImageWhereUniqueInput
  }

  /**
   * PropertyImage deleteMany
   */
  export type PropertyImageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PropertyImages to delete
     */
    where?: PropertyImageWhereInput
    /**
     * Limit how many PropertyImages to delete.
     */
    limit?: number
  }

  /**
   * PropertyImage without action
   */
  export type PropertyImageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyImage
     */
    select?: PropertyImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyImage
     */
    omit?: PropertyImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyImageInclude<ExtArgs> | null
  }


  /**
   * Model PriceHistory
   */

  export type AggregatePriceHistory = {
    _count: PriceHistoryCountAggregateOutputType | null
    _avg: PriceHistoryAvgAggregateOutputType | null
    _sum: PriceHistorySumAggregateOutputType | null
    _min: PriceHistoryMinAggregateOutputType | null
    _max: PriceHistoryMaxAggregateOutputType | null
  }

  export type PriceHistoryAvgAggregateOutputType = {
    oldPrice: Decimal | null
    newPrice: Decimal | null
  }

  export type PriceHistorySumAggregateOutputType = {
    oldPrice: Decimal | null
    newPrice: Decimal | null
  }

  export type PriceHistoryMinAggregateOutputType = {
    id: string | null
    propertyId: string | null
    oldPrice: Decimal | null
    newPrice: Decimal | null
    reason: string | null
    changedAt: Date | null
    changedBy: string | null
  }

  export type PriceHistoryMaxAggregateOutputType = {
    id: string | null
    propertyId: string | null
    oldPrice: Decimal | null
    newPrice: Decimal | null
    reason: string | null
    changedAt: Date | null
    changedBy: string | null
  }

  export type PriceHistoryCountAggregateOutputType = {
    id: number
    propertyId: number
    oldPrice: number
    newPrice: number
    reason: number
    changedAt: number
    changedBy: number
    _all: number
  }


  export type PriceHistoryAvgAggregateInputType = {
    oldPrice?: true
    newPrice?: true
  }

  export type PriceHistorySumAggregateInputType = {
    oldPrice?: true
    newPrice?: true
  }

  export type PriceHistoryMinAggregateInputType = {
    id?: true
    propertyId?: true
    oldPrice?: true
    newPrice?: true
    reason?: true
    changedAt?: true
    changedBy?: true
  }

  export type PriceHistoryMaxAggregateInputType = {
    id?: true
    propertyId?: true
    oldPrice?: true
    newPrice?: true
    reason?: true
    changedAt?: true
    changedBy?: true
  }

  export type PriceHistoryCountAggregateInputType = {
    id?: true
    propertyId?: true
    oldPrice?: true
    newPrice?: true
    reason?: true
    changedAt?: true
    changedBy?: true
    _all?: true
  }

  export type PriceHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PriceHistory to aggregate.
     */
    where?: PriceHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceHistories to fetch.
     */
    orderBy?: PriceHistoryOrderByWithRelationInput | PriceHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PriceHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PriceHistories
    **/
    _count?: true | PriceHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PriceHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PriceHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PriceHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PriceHistoryMaxAggregateInputType
  }

  export type GetPriceHistoryAggregateType<T extends PriceHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregatePriceHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePriceHistory[P]>
      : GetScalarType<T[P], AggregatePriceHistory[P]>
  }




  export type PriceHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PriceHistoryWhereInput
    orderBy?: PriceHistoryOrderByWithAggregationInput | PriceHistoryOrderByWithAggregationInput[]
    by: PriceHistoryScalarFieldEnum[] | PriceHistoryScalarFieldEnum
    having?: PriceHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PriceHistoryCountAggregateInputType | true
    _avg?: PriceHistoryAvgAggregateInputType
    _sum?: PriceHistorySumAggregateInputType
    _min?: PriceHistoryMinAggregateInputType
    _max?: PriceHistoryMaxAggregateInputType
  }

  export type PriceHistoryGroupByOutputType = {
    id: string
    propertyId: string
    oldPrice: Decimal | null
    newPrice: Decimal
    reason: string | null
    changedAt: Date
    changedBy: string | null
    _count: PriceHistoryCountAggregateOutputType | null
    _avg: PriceHistoryAvgAggregateOutputType | null
    _sum: PriceHistorySumAggregateOutputType | null
    _min: PriceHistoryMinAggregateOutputType | null
    _max: PriceHistoryMaxAggregateOutputType | null
  }

  type GetPriceHistoryGroupByPayload<T extends PriceHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PriceHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PriceHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PriceHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], PriceHistoryGroupByOutputType[P]>
        }
      >
    >


  export type PriceHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    oldPrice?: boolean
    newPrice?: boolean
    reason?: boolean
    changedAt?: boolean
    changedBy?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["priceHistory"]>

  export type PriceHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    oldPrice?: boolean
    newPrice?: boolean
    reason?: boolean
    changedAt?: boolean
    changedBy?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["priceHistory"]>

  export type PriceHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    oldPrice?: boolean
    newPrice?: boolean
    reason?: boolean
    changedAt?: boolean
    changedBy?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["priceHistory"]>

  export type PriceHistorySelectScalar = {
    id?: boolean
    propertyId?: boolean
    oldPrice?: boolean
    newPrice?: boolean
    reason?: boolean
    changedAt?: boolean
    changedBy?: boolean
  }

  export type PriceHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "propertyId" | "oldPrice" | "newPrice" | "reason" | "changedAt" | "changedBy", ExtArgs["result"]["priceHistory"]>
  export type PriceHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }
  export type PriceHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }
  export type PriceHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }

  export type $PriceHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PriceHistory"
    objects: {
      property: Prisma.$PropertyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      propertyId: string
      oldPrice: Prisma.Decimal | null
      newPrice: Prisma.Decimal
      reason: string | null
      changedAt: Date
      changedBy: string | null
    }, ExtArgs["result"]["priceHistory"]>
    composites: {}
  }

  type PriceHistoryGetPayload<S extends boolean | null | undefined | PriceHistoryDefaultArgs> = $Result.GetResult<Prisma.$PriceHistoryPayload, S>

  type PriceHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PriceHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PriceHistoryCountAggregateInputType | true
    }

  export interface PriceHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PriceHistory'], meta: { name: 'PriceHistory' } }
    /**
     * Find zero or one PriceHistory that matches the filter.
     * @param {PriceHistoryFindUniqueArgs} args - Arguments to find a PriceHistory
     * @example
     * // Get one PriceHistory
     * const priceHistory = await prisma.priceHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PriceHistoryFindUniqueArgs>(args: SelectSubset<T, PriceHistoryFindUniqueArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PriceHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PriceHistoryFindUniqueOrThrowArgs} args - Arguments to find a PriceHistory
     * @example
     * // Get one PriceHistory
     * const priceHistory = await prisma.priceHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PriceHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, PriceHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PriceHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceHistoryFindFirstArgs} args - Arguments to find a PriceHistory
     * @example
     * // Get one PriceHistory
     * const priceHistory = await prisma.priceHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PriceHistoryFindFirstArgs>(args?: SelectSubset<T, PriceHistoryFindFirstArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PriceHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceHistoryFindFirstOrThrowArgs} args - Arguments to find a PriceHistory
     * @example
     * // Get one PriceHistory
     * const priceHistory = await prisma.priceHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PriceHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, PriceHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PriceHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PriceHistories
     * const priceHistories = await prisma.priceHistory.findMany()
     * 
     * // Get first 10 PriceHistories
     * const priceHistories = await prisma.priceHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const priceHistoryWithIdOnly = await prisma.priceHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PriceHistoryFindManyArgs>(args?: SelectSubset<T, PriceHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PriceHistory.
     * @param {PriceHistoryCreateArgs} args - Arguments to create a PriceHistory.
     * @example
     * // Create one PriceHistory
     * const PriceHistory = await prisma.priceHistory.create({
     *   data: {
     *     // ... data to create a PriceHistory
     *   }
     * })
     * 
     */
    create<T extends PriceHistoryCreateArgs>(args: SelectSubset<T, PriceHistoryCreateArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PriceHistories.
     * @param {PriceHistoryCreateManyArgs} args - Arguments to create many PriceHistories.
     * @example
     * // Create many PriceHistories
     * const priceHistory = await prisma.priceHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PriceHistoryCreateManyArgs>(args?: SelectSubset<T, PriceHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PriceHistories and returns the data saved in the database.
     * @param {PriceHistoryCreateManyAndReturnArgs} args - Arguments to create many PriceHistories.
     * @example
     * // Create many PriceHistories
     * const priceHistory = await prisma.priceHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PriceHistories and only return the `id`
     * const priceHistoryWithIdOnly = await prisma.priceHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PriceHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, PriceHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PriceHistory.
     * @param {PriceHistoryDeleteArgs} args - Arguments to delete one PriceHistory.
     * @example
     * // Delete one PriceHistory
     * const PriceHistory = await prisma.priceHistory.delete({
     *   where: {
     *     // ... filter to delete one PriceHistory
     *   }
     * })
     * 
     */
    delete<T extends PriceHistoryDeleteArgs>(args: SelectSubset<T, PriceHistoryDeleteArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PriceHistory.
     * @param {PriceHistoryUpdateArgs} args - Arguments to update one PriceHistory.
     * @example
     * // Update one PriceHistory
     * const priceHistory = await prisma.priceHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PriceHistoryUpdateArgs>(args: SelectSubset<T, PriceHistoryUpdateArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PriceHistories.
     * @param {PriceHistoryDeleteManyArgs} args - Arguments to filter PriceHistories to delete.
     * @example
     * // Delete a few PriceHistories
     * const { count } = await prisma.priceHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PriceHistoryDeleteManyArgs>(args?: SelectSubset<T, PriceHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PriceHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PriceHistories
     * const priceHistory = await prisma.priceHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PriceHistoryUpdateManyArgs>(args: SelectSubset<T, PriceHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PriceHistories and returns the data updated in the database.
     * @param {PriceHistoryUpdateManyAndReturnArgs} args - Arguments to update many PriceHistories.
     * @example
     * // Update many PriceHistories
     * const priceHistory = await prisma.priceHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PriceHistories and only return the `id`
     * const priceHistoryWithIdOnly = await prisma.priceHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PriceHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, PriceHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PriceHistory.
     * @param {PriceHistoryUpsertArgs} args - Arguments to update or create a PriceHistory.
     * @example
     * // Update or create a PriceHistory
     * const priceHistory = await prisma.priceHistory.upsert({
     *   create: {
     *     // ... data to create a PriceHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PriceHistory we want to update
     *   }
     * })
     */
    upsert<T extends PriceHistoryUpsertArgs>(args: SelectSubset<T, PriceHistoryUpsertArgs<ExtArgs>>): Prisma__PriceHistoryClient<$Result.GetResult<Prisma.$PriceHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PriceHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceHistoryCountArgs} args - Arguments to filter PriceHistories to count.
     * @example
     * // Count the number of PriceHistories
     * const count = await prisma.priceHistory.count({
     *   where: {
     *     // ... the filter for the PriceHistories we want to count
     *   }
     * })
    **/
    count<T extends PriceHistoryCountArgs>(
      args?: Subset<T, PriceHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PriceHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PriceHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PriceHistoryAggregateArgs>(args: Subset<T, PriceHistoryAggregateArgs>): Prisma.PrismaPromise<GetPriceHistoryAggregateType<T>>

    /**
     * Group by PriceHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PriceHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PriceHistoryGroupByArgs['orderBy'] }
        : { orderBy?: PriceHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PriceHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPriceHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PriceHistory model
   */
  readonly fields: PriceHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PriceHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PriceHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PriceHistory model
   */
  interface PriceHistoryFieldRefs {
    readonly id: FieldRef<"PriceHistory", 'String'>
    readonly propertyId: FieldRef<"PriceHistory", 'String'>
    readonly oldPrice: FieldRef<"PriceHistory", 'Decimal'>
    readonly newPrice: FieldRef<"PriceHistory", 'Decimal'>
    readonly reason: FieldRef<"PriceHistory", 'String'>
    readonly changedAt: FieldRef<"PriceHistory", 'DateTime'>
    readonly changedBy: FieldRef<"PriceHistory", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PriceHistory findUnique
   */
  export type PriceHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PriceHistory to fetch.
     */
    where: PriceHistoryWhereUniqueInput
  }

  /**
   * PriceHistory findUniqueOrThrow
   */
  export type PriceHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PriceHistory to fetch.
     */
    where: PriceHistoryWhereUniqueInput
  }

  /**
   * PriceHistory findFirst
   */
  export type PriceHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PriceHistory to fetch.
     */
    where?: PriceHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceHistories to fetch.
     */
    orderBy?: PriceHistoryOrderByWithRelationInput | PriceHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PriceHistories.
     */
    cursor?: PriceHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriceHistories.
     */
    distinct?: PriceHistoryScalarFieldEnum | PriceHistoryScalarFieldEnum[]
  }

  /**
   * PriceHistory findFirstOrThrow
   */
  export type PriceHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PriceHistory to fetch.
     */
    where?: PriceHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceHistories to fetch.
     */
    orderBy?: PriceHistoryOrderByWithRelationInput | PriceHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PriceHistories.
     */
    cursor?: PriceHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriceHistories.
     */
    distinct?: PriceHistoryScalarFieldEnum | PriceHistoryScalarFieldEnum[]
  }

  /**
   * PriceHistory findMany
   */
  export type PriceHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PriceHistories to fetch.
     */
    where?: PriceHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceHistories to fetch.
     */
    orderBy?: PriceHistoryOrderByWithRelationInput | PriceHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PriceHistories.
     */
    cursor?: PriceHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceHistories.
     */
    skip?: number
    distinct?: PriceHistoryScalarFieldEnum | PriceHistoryScalarFieldEnum[]
  }

  /**
   * PriceHistory create
   */
  export type PriceHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a PriceHistory.
     */
    data: XOR<PriceHistoryCreateInput, PriceHistoryUncheckedCreateInput>
  }

  /**
   * PriceHistory createMany
   */
  export type PriceHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PriceHistories.
     */
    data: PriceHistoryCreateManyInput | PriceHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PriceHistory createManyAndReturn
   */
  export type PriceHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many PriceHistories.
     */
    data: PriceHistoryCreateManyInput | PriceHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PriceHistory update
   */
  export type PriceHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a PriceHistory.
     */
    data: XOR<PriceHistoryUpdateInput, PriceHistoryUncheckedUpdateInput>
    /**
     * Choose, which PriceHistory to update.
     */
    where: PriceHistoryWhereUniqueInput
  }

  /**
   * PriceHistory updateMany
   */
  export type PriceHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PriceHistories.
     */
    data: XOR<PriceHistoryUpdateManyMutationInput, PriceHistoryUncheckedUpdateManyInput>
    /**
     * Filter which PriceHistories to update
     */
    where?: PriceHistoryWhereInput
    /**
     * Limit how many PriceHistories to update.
     */
    limit?: number
  }

  /**
   * PriceHistory updateManyAndReturn
   */
  export type PriceHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * The data used to update PriceHistories.
     */
    data: XOR<PriceHistoryUpdateManyMutationInput, PriceHistoryUncheckedUpdateManyInput>
    /**
     * Filter which PriceHistories to update
     */
    where?: PriceHistoryWhereInput
    /**
     * Limit how many PriceHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PriceHistory upsert
   */
  export type PriceHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the PriceHistory to update in case it exists.
     */
    where: PriceHistoryWhereUniqueInput
    /**
     * In case the PriceHistory found by the `where` argument doesn't exist, create a new PriceHistory with this data.
     */
    create: XOR<PriceHistoryCreateInput, PriceHistoryUncheckedCreateInput>
    /**
     * In case the PriceHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PriceHistoryUpdateInput, PriceHistoryUncheckedUpdateInput>
  }

  /**
   * PriceHistory delete
   */
  export type PriceHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
    /**
     * Filter which PriceHistory to delete.
     */
    where: PriceHistoryWhereUniqueInput
  }

  /**
   * PriceHistory deleteMany
   */
  export type PriceHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PriceHistories to delete
     */
    where?: PriceHistoryWhereInput
    /**
     * Limit how many PriceHistories to delete.
     */
    limit?: number
  }

  /**
   * PriceHistory without action
   */
  export type PriceHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceHistory
     */
    select?: PriceHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceHistory
     */
    omit?: PriceHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceHistoryInclude<ExtArgs> | null
  }


  /**
   * Model PropertyVisit
   */

  export type AggregatePropertyVisit = {
    _count: PropertyVisitCountAggregateOutputType | null
    _min: PropertyVisitMinAggregateOutputType | null
    _max: PropertyVisitMaxAggregateOutputType | null
  }

  export type PropertyVisitMinAggregateOutputType = {
    id: string | null
    propertyId: string | null
    visitorId: string | null
    ipAddress: string | null
    userAgent: string | null
    visitedAt: Date | null
  }

  export type PropertyVisitMaxAggregateOutputType = {
    id: string | null
    propertyId: string | null
    visitorId: string | null
    ipAddress: string | null
    userAgent: string | null
    visitedAt: Date | null
  }

  export type PropertyVisitCountAggregateOutputType = {
    id: number
    propertyId: number
    visitorId: number
    ipAddress: number
    userAgent: number
    visitedAt: number
    _all: number
  }


  export type PropertyVisitMinAggregateInputType = {
    id?: true
    propertyId?: true
    visitorId?: true
    ipAddress?: true
    userAgent?: true
    visitedAt?: true
  }

  export type PropertyVisitMaxAggregateInputType = {
    id?: true
    propertyId?: true
    visitorId?: true
    ipAddress?: true
    userAgent?: true
    visitedAt?: true
  }

  export type PropertyVisitCountAggregateInputType = {
    id?: true
    propertyId?: true
    visitorId?: true
    ipAddress?: true
    userAgent?: true
    visitedAt?: true
    _all?: true
  }

  export type PropertyVisitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PropertyVisit to aggregate.
     */
    where?: PropertyVisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertyVisits to fetch.
     */
    orderBy?: PropertyVisitOrderByWithRelationInput | PropertyVisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PropertyVisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertyVisits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertyVisits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PropertyVisits
    **/
    _count?: true | PropertyVisitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PropertyVisitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PropertyVisitMaxAggregateInputType
  }

  export type GetPropertyVisitAggregateType<T extends PropertyVisitAggregateArgs> = {
        [P in keyof T & keyof AggregatePropertyVisit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePropertyVisit[P]>
      : GetScalarType<T[P], AggregatePropertyVisit[P]>
  }




  export type PropertyVisitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyVisitWhereInput
    orderBy?: PropertyVisitOrderByWithAggregationInput | PropertyVisitOrderByWithAggregationInput[]
    by: PropertyVisitScalarFieldEnum[] | PropertyVisitScalarFieldEnum
    having?: PropertyVisitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PropertyVisitCountAggregateInputType | true
    _min?: PropertyVisitMinAggregateInputType
    _max?: PropertyVisitMaxAggregateInputType
  }

  export type PropertyVisitGroupByOutputType = {
    id: string
    propertyId: string
    visitorId: string | null
    ipAddress: string
    userAgent: string | null
    visitedAt: Date
    _count: PropertyVisitCountAggregateOutputType | null
    _min: PropertyVisitMinAggregateOutputType | null
    _max: PropertyVisitMaxAggregateOutputType | null
  }

  type GetPropertyVisitGroupByPayload<T extends PropertyVisitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PropertyVisitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PropertyVisitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PropertyVisitGroupByOutputType[P]>
            : GetScalarType<T[P], PropertyVisitGroupByOutputType[P]>
        }
      >
    >


  export type PropertyVisitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    visitorId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    visitedAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["propertyVisit"]>

  export type PropertyVisitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    visitorId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    visitedAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["propertyVisit"]>

  export type PropertyVisitSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    visitorId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    visitedAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["propertyVisit"]>

  export type PropertyVisitSelectScalar = {
    id?: boolean
    propertyId?: boolean
    visitorId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    visitedAt?: boolean
  }

  export type PropertyVisitOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "propertyId" | "visitorId" | "ipAddress" | "userAgent" | "visitedAt", ExtArgs["result"]["propertyVisit"]>
  export type PropertyVisitInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }
  export type PropertyVisitIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }
  export type PropertyVisitIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }

  export type $PropertyVisitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PropertyVisit"
    objects: {
      property: Prisma.$PropertyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      propertyId: string
      visitorId: string | null
      ipAddress: string
      userAgent: string | null
      visitedAt: Date
    }, ExtArgs["result"]["propertyVisit"]>
    composites: {}
  }

  type PropertyVisitGetPayload<S extends boolean | null | undefined | PropertyVisitDefaultArgs> = $Result.GetResult<Prisma.$PropertyVisitPayload, S>

  type PropertyVisitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PropertyVisitFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PropertyVisitCountAggregateInputType | true
    }

  export interface PropertyVisitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PropertyVisit'], meta: { name: 'PropertyVisit' } }
    /**
     * Find zero or one PropertyVisit that matches the filter.
     * @param {PropertyVisitFindUniqueArgs} args - Arguments to find a PropertyVisit
     * @example
     * // Get one PropertyVisit
     * const propertyVisit = await prisma.propertyVisit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PropertyVisitFindUniqueArgs>(args: SelectSubset<T, PropertyVisitFindUniqueArgs<ExtArgs>>): Prisma__PropertyVisitClient<$Result.GetResult<Prisma.$PropertyVisitPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PropertyVisit that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PropertyVisitFindUniqueOrThrowArgs} args - Arguments to find a PropertyVisit
     * @example
     * // Get one PropertyVisit
     * const propertyVisit = await prisma.propertyVisit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PropertyVisitFindUniqueOrThrowArgs>(args: SelectSubset<T, PropertyVisitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PropertyVisitClient<$Result.GetResult<Prisma.$PropertyVisitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PropertyVisit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyVisitFindFirstArgs} args - Arguments to find a PropertyVisit
     * @example
     * // Get one PropertyVisit
     * const propertyVisit = await prisma.propertyVisit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PropertyVisitFindFirstArgs>(args?: SelectSubset<T, PropertyVisitFindFirstArgs<ExtArgs>>): Prisma__PropertyVisitClient<$Result.GetResult<Prisma.$PropertyVisitPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PropertyVisit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyVisitFindFirstOrThrowArgs} args - Arguments to find a PropertyVisit
     * @example
     * // Get one PropertyVisit
     * const propertyVisit = await prisma.propertyVisit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PropertyVisitFindFirstOrThrowArgs>(args?: SelectSubset<T, PropertyVisitFindFirstOrThrowArgs<ExtArgs>>): Prisma__PropertyVisitClient<$Result.GetResult<Prisma.$PropertyVisitPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PropertyVisits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyVisitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PropertyVisits
     * const propertyVisits = await prisma.propertyVisit.findMany()
     * 
     * // Get first 10 PropertyVisits
     * const propertyVisits = await prisma.propertyVisit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const propertyVisitWithIdOnly = await prisma.propertyVisit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PropertyVisitFindManyArgs>(args?: SelectSubset<T, PropertyVisitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyVisitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PropertyVisit.
     * @param {PropertyVisitCreateArgs} args - Arguments to create a PropertyVisit.
     * @example
     * // Create one PropertyVisit
     * const PropertyVisit = await prisma.propertyVisit.create({
     *   data: {
     *     // ... data to create a PropertyVisit
     *   }
     * })
     * 
     */
    create<T extends PropertyVisitCreateArgs>(args: SelectSubset<T, PropertyVisitCreateArgs<ExtArgs>>): Prisma__PropertyVisitClient<$Result.GetResult<Prisma.$PropertyVisitPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PropertyVisits.
     * @param {PropertyVisitCreateManyArgs} args - Arguments to create many PropertyVisits.
     * @example
     * // Create many PropertyVisits
     * const propertyVisit = await prisma.propertyVisit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PropertyVisitCreateManyArgs>(args?: SelectSubset<T, PropertyVisitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PropertyVisits and returns the data saved in the database.
     * @param {PropertyVisitCreateManyAndReturnArgs} args - Arguments to create many PropertyVisits.
     * @example
     * // Create many PropertyVisits
     * const propertyVisit = await prisma.propertyVisit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PropertyVisits and only return the `id`
     * const propertyVisitWithIdOnly = await prisma.propertyVisit.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PropertyVisitCreateManyAndReturnArgs>(args?: SelectSubset<T, PropertyVisitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyVisitPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PropertyVisit.
     * @param {PropertyVisitDeleteArgs} args - Arguments to delete one PropertyVisit.
     * @example
     * // Delete one PropertyVisit
     * const PropertyVisit = await prisma.propertyVisit.delete({
     *   where: {
     *     // ... filter to delete one PropertyVisit
     *   }
     * })
     * 
     */
    delete<T extends PropertyVisitDeleteArgs>(args: SelectSubset<T, PropertyVisitDeleteArgs<ExtArgs>>): Prisma__PropertyVisitClient<$Result.GetResult<Prisma.$PropertyVisitPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PropertyVisit.
     * @param {PropertyVisitUpdateArgs} args - Arguments to update one PropertyVisit.
     * @example
     * // Update one PropertyVisit
     * const propertyVisit = await prisma.propertyVisit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PropertyVisitUpdateArgs>(args: SelectSubset<T, PropertyVisitUpdateArgs<ExtArgs>>): Prisma__PropertyVisitClient<$Result.GetResult<Prisma.$PropertyVisitPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PropertyVisits.
     * @param {PropertyVisitDeleteManyArgs} args - Arguments to filter PropertyVisits to delete.
     * @example
     * // Delete a few PropertyVisits
     * const { count } = await prisma.propertyVisit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PropertyVisitDeleteManyArgs>(args?: SelectSubset<T, PropertyVisitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PropertyVisits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyVisitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PropertyVisits
     * const propertyVisit = await prisma.propertyVisit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PropertyVisitUpdateManyArgs>(args: SelectSubset<T, PropertyVisitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PropertyVisits and returns the data updated in the database.
     * @param {PropertyVisitUpdateManyAndReturnArgs} args - Arguments to update many PropertyVisits.
     * @example
     * // Update many PropertyVisits
     * const propertyVisit = await prisma.propertyVisit.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PropertyVisits and only return the `id`
     * const propertyVisitWithIdOnly = await prisma.propertyVisit.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PropertyVisitUpdateManyAndReturnArgs>(args: SelectSubset<T, PropertyVisitUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyVisitPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PropertyVisit.
     * @param {PropertyVisitUpsertArgs} args - Arguments to update or create a PropertyVisit.
     * @example
     * // Update or create a PropertyVisit
     * const propertyVisit = await prisma.propertyVisit.upsert({
     *   create: {
     *     // ... data to create a PropertyVisit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PropertyVisit we want to update
     *   }
     * })
     */
    upsert<T extends PropertyVisitUpsertArgs>(args: SelectSubset<T, PropertyVisitUpsertArgs<ExtArgs>>): Prisma__PropertyVisitClient<$Result.GetResult<Prisma.$PropertyVisitPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PropertyVisits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyVisitCountArgs} args - Arguments to filter PropertyVisits to count.
     * @example
     * // Count the number of PropertyVisits
     * const count = await prisma.propertyVisit.count({
     *   where: {
     *     // ... the filter for the PropertyVisits we want to count
     *   }
     * })
    **/
    count<T extends PropertyVisitCountArgs>(
      args?: Subset<T, PropertyVisitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PropertyVisitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PropertyVisit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyVisitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PropertyVisitAggregateArgs>(args: Subset<T, PropertyVisitAggregateArgs>): Prisma.PrismaPromise<GetPropertyVisitAggregateType<T>>

    /**
     * Group by PropertyVisit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyVisitGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PropertyVisitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PropertyVisitGroupByArgs['orderBy'] }
        : { orderBy?: PropertyVisitGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PropertyVisitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPropertyVisitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PropertyVisit model
   */
  readonly fields: PropertyVisitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PropertyVisit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PropertyVisitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PropertyVisit model
   */
  interface PropertyVisitFieldRefs {
    readonly id: FieldRef<"PropertyVisit", 'String'>
    readonly propertyId: FieldRef<"PropertyVisit", 'String'>
    readonly visitorId: FieldRef<"PropertyVisit", 'String'>
    readonly ipAddress: FieldRef<"PropertyVisit", 'String'>
    readonly userAgent: FieldRef<"PropertyVisit", 'String'>
    readonly visitedAt: FieldRef<"PropertyVisit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PropertyVisit findUnique
   */
  export type PropertyVisitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyVisit
     */
    select?: PropertyVisitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyVisit
     */
    omit?: PropertyVisitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyVisitInclude<ExtArgs> | null
    /**
     * Filter, which PropertyVisit to fetch.
     */
    where: PropertyVisitWhereUniqueInput
  }

  /**
   * PropertyVisit findUniqueOrThrow
   */
  export type PropertyVisitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyVisit
     */
    select?: PropertyVisitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyVisit
     */
    omit?: PropertyVisitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyVisitInclude<ExtArgs> | null
    /**
     * Filter, which PropertyVisit to fetch.
     */
    where: PropertyVisitWhereUniqueInput
  }

  /**
   * PropertyVisit findFirst
   */
  export type PropertyVisitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyVisit
     */
    select?: PropertyVisitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyVisit
     */
    omit?: PropertyVisitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyVisitInclude<ExtArgs> | null
    /**
     * Filter, which PropertyVisit to fetch.
     */
    where?: PropertyVisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertyVisits to fetch.
     */
    orderBy?: PropertyVisitOrderByWithRelationInput | PropertyVisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PropertyVisits.
     */
    cursor?: PropertyVisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertyVisits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertyVisits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PropertyVisits.
     */
    distinct?: PropertyVisitScalarFieldEnum | PropertyVisitScalarFieldEnum[]
  }

  /**
   * PropertyVisit findFirstOrThrow
   */
  export type PropertyVisitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyVisit
     */
    select?: PropertyVisitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyVisit
     */
    omit?: PropertyVisitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyVisitInclude<ExtArgs> | null
    /**
     * Filter, which PropertyVisit to fetch.
     */
    where?: PropertyVisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertyVisits to fetch.
     */
    orderBy?: PropertyVisitOrderByWithRelationInput | PropertyVisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PropertyVisits.
     */
    cursor?: PropertyVisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertyVisits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertyVisits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PropertyVisits.
     */
    distinct?: PropertyVisitScalarFieldEnum | PropertyVisitScalarFieldEnum[]
  }

  /**
   * PropertyVisit findMany
   */
  export type PropertyVisitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyVisit
     */
    select?: PropertyVisitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyVisit
     */
    omit?: PropertyVisitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyVisitInclude<ExtArgs> | null
    /**
     * Filter, which PropertyVisits to fetch.
     */
    where?: PropertyVisitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertyVisits to fetch.
     */
    orderBy?: PropertyVisitOrderByWithRelationInput | PropertyVisitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PropertyVisits.
     */
    cursor?: PropertyVisitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertyVisits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertyVisits.
     */
    skip?: number
    distinct?: PropertyVisitScalarFieldEnum | PropertyVisitScalarFieldEnum[]
  }

  /**
   * PropertyVisit create
   */
  export type PropertyVisitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyVisit
     */
    select?: PropertyVisitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyVisit
     */
    omit?: PropertyVisitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyVisitInclude<ExtArgs> | null
    /**
     * The data needed to create a PropertyVisit.
     */
    data: XOR<PropertyVisitCreateInput, PropertyVisitUncheckedCreateInput>
  }

  /**
   * PropertyVisit createMany
   */
  export type PropertyVisitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PropertyVisits.
     */
    data: PropertyVisitCreateManyInput | PropertyVisitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PropertyVisit createManyAndReturn
   */
  export type PropertyVisitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyVisit
     */
    select?: PropertyVisitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyVisit
     */
    omit?: PropertyVisitOmit<ExtArgs> | null
    /**
     * The data used to create many PropertyVisits.
     */
    data: PropertyVisitCreateManyInput | PropertyVisitCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyVisitIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PropertyVisit update
   */
  export type PropertyVisitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyVisit
     */
    select?: PropertyVisitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyVisit
     */
    omit?: PropertyVisitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyVisitInclude<ExtArgs> | null
    /**
     * The data needed to update a PropertyVisit.
     */
    data: XOR<PropertyVisitUpdateInput, PropertyVisitUncheckedUpdateInput>
    /**
     * Choose, which PropertyVisit to update.
     */
    where: PropertyVisitWhereUniqueInput
  }

  /**
   * PropertyVisit updateMany
   */
  export type PropertyVisitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PropertyVisits.
     */
    data: XOR<PropertyVisitUpdateManyMutationInput, PropertyVisitUncheckedUpdateManyInput>
    /**
     * Filter which PropertyVisits to update
     */
    where?: PropertyVisitWhereInput
    /**
     * Limit how many PropertyVisits to update.
     */
    limit?: number
  }

  /**
   * PropertyVisit updateManyAndReturn
   */
  export type PropertyVisitUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyVisit
     */
    select?: PropertyVisitSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyVisit
     */
    omit?: PropertyVisitOmit<ExtArgs> | null
    /**
     * The data used to update PropertyVisits.
     */
    data: XOR<PropertyVisitUpdateManyMutationInput, PropertyVisitUncheckedUpdateManyInput>
    /**
     * Filter which PropertyVisits to update
     */
    where?: PropertyVisitWhereInput
    /**
     * Limit how many PropertyVisits to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyVisitIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PropertyVisit upsert
   */
  export type PropertyVisitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyVisit
     */
    select?: PropertyVisitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyVisit
     */
    omit?: PropertyVisitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyVisitInclude<ExtArgs> | null
    /**
     * The filter to search for the PropertyVisit to update in case it exists.
     */
    where: PropertyVisitWhereUniqueInput
    /**
     * In case the PropertyVisit found by the `where` argument doesn't exist, create a new PropertyVisit with this data.
     */
    create: XOR<PropertyVisitCreateInput, PropertyVisitUncheckedCreateInput>
    /**
     * In case the PropertyVisit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PropertyVisitUpdateInput, PropertyVisitUncheckedUpdateInput>
  }

  /**
   * PropertyVisit delete
   */
  export type PropertyVisitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyVisit
     */
    select?: PropertyVisitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyVisit
     */
    omit?: PropertyVisitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyVisitInclude<ExtArgs> | null
    /**
     * Filter which PropertyVisit to delete.
     */
    where: PropertyVisitWhereUniqueInput
  }

  /**
   * PropertyVisit deleteMany
   */
  export type PropertyVisitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PropertyVisits to delete
     */
    where?: PropertyVisitWhereInput
    /**
     * Limit how many PropertyVisits to delete.
     */
    limit?: number
  }

  /**
   * PropertyVisit without action
   */
  export type PropertyVisitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyVisit
     */
    select?: PropertyVisitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyVisit
     */
    omit?: PropertyVisitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyVisitInclude<ExtArgs> | null
  }


  /**
   * Model PropertyFavorite
   */

  export type AggregatePropertyFavorite = {
    _count: PropertyFavoriteCountAggregateOutputType | null
    _min: PropertyFavoriteMinAggregateOutputType | null
    _max: PropertyFavoriteMaxAggregateOutputType | null
  }

  export type PropertyFavoriteMinAggregateOutputType = {
    id: string | null
    propertyId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type PropertyFavoriteMaxAggregateOutputType = {
    id: string | null
    propertyId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type PropertyFavoriteCountAggregateOutputType = {
    id: number
    propertyId: number
    userId: number
    createdAt: number
    _all: number
  }


  export type PropertyFavoriteMinAggregateInputType = {
    id?: true
    propertyId?: true
    userId?: true
    createdAt?: true
  }

  export type PropertyFavoriteMaxAggregateInputType = {
    id?: true
    propertyId?: true
    userId?: true
    createdAt?: true
  }

  export type PropertyFavoriteCountAggregateInputType = {
    id?: true
    propertyId?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type PropertyFavoriteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PropertyFavorite to aggregate.
     */
    where?: PropertyFavoriteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertyFavorites to fetch.
     */
    orderBy?: PropertyFavoriteOrderByWithRelationInput | PropertyFavoriteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PropertyFavoriteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertyFavorites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertyFavorites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PropertyFavorites
    **/
    _count?: true | PropertyFavoriteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PropertyFavoriteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PropertyFavoriteMaxAggregateInputType
  }

  export type GetPropertyFavoriteAggregateType<T extends PropertyFavoriteAggregateArgs> = {
        [P in keyof T & keyof AggregatePropertyFavorite]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePropertyFavorite[P]>
      : GetScalarType<T[P], AggregatePropertyFavorite[P]>
  }




  export type PropertyFavoriteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyFavoriteWhereInput
    orderBy?: PropertyFavoriteOrderByWithAggregationInput | PropertyFavoriteOrderByWithAggregationInput[]
    by: PropertyFavoriteScalarFieldEnum[] | PropertyFavoriteScalarFieldEnum
    having?: PropertyFavoriteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PropertyFavoriteCountAggregateInputType | true
    _min?: PropertyFavoriteMinAggregateInputType
    _max?: PropertyFavoriteMaxAggregateInputType
  }

  export type PropertyFavoriteGroupByOutputType = {
    id: string
    propertyId: string
    userId: string
    createdAt: Date
    _count: PropertyFavoriteCountAggregateOutputType | null
    _min: PropertyFavoriteMinAggregateOutputType | null
    _max: PropertyFavoriteMaxAggregateOutputType | null
  }

  type GetPropertyFavoriteGroupByPayload<T extends PropertyFavoriteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PropertyFavoriteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PropertyFavoriteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PropertyFavoriteGroupByOutputType[P]>
            : GetScalarType<T[P], PropertyFavoriteGroupByOutputType[P]>
        }
      >
    >


  export type PropertyFavoriteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    userId?: boolean
    createdAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["propertyFavorite"]>

  export type PropertyFavoriteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    userId?: boolean
    createdAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["propertyFavorite"]>

  export type PropertyFavoriteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    userId?: boolean
    createdAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["propertyFavorite"]>

  export type PropertyFavoriteSelectScalar = {
    id?: boolean
    propertyId?: boolean
    userId?: boolean
    createdAt?: boolean
  }

  export type PropertyFavoriteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "propertyId" | "userId" | "createdAt", ExtArgs["result"]["propertyFavorite"]>
  export type PropertyFavoriteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }
  export type PropertyFavoriteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }
  export type PropertyFavoriteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }

  export type $PropertyFavoritePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PropertyFavorite"
    objects: {
      property: Prisma.$PropertyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      propertyId: string
      userId: string
      createdAt: Date
    }, ExtArgs["result"]["propertyFavorite"]>
    composites: {}
  }

  type PropertyFavoriteGetPayload<S extends boolean | null | undefined | PropertyFavoriteDefaultArgs> = $Result.GetResult<Prisma.$PropertyFavoritePayload, S>

  type PropertyFavoriteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PropertyFavoriteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PropertyFavoriteCountAggregateInputType | true
    }

  export interface PropertyFavoriteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PropertyFavorite'], meta: { name: 'PropertyFavorite' } }
    /**
     * Find zero or one PropertyFavorite that matches the filter.
     * @param {PropertyFavoriteFindUniqueArgs} args - Arguments to find a PropertyFavorite
     * @example
     * // Get one PropertyFavorite
     * const propertyFavorite = await prisma.propertyFavorite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PropertyFavoriteFindUniqueArgs>(args: SelectSubset<T, PropertyFavoriteFindUniqueArgs<ExtArgs>>): Prisma__PropertyFavoriteClient<$Result.GetResult<Prisma.$PropertyFavoritePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PropertyFavorite that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PropertyFavoriteFindUniqueOrThrowArgs} args - Arguments to find a PropertyFavorite
     * @example
     * // Get one PropertyFavorite
     * const propertyFavorite = await prisma.propertyFavorite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PropertyFavoriteFindUniqueOrThrowArgs>(args: SelectSubset<T, PropertyFavoriteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PropertyFavoriteClient<$Result.GetResult<Prisma.$PropertyFavoritePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PropertyFavorite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFavoriteFindFirstArgs} args - Arguments to find a PropertyFavorite
     * @example
     * // Get one PropertyFavorite
     * const propertyFavorite = await prisma.propertyFavorite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PropertyFavoriteFindFirstArgs>(args?: SelectSubset<T, PropertyFavoriteFindFirstArgs<ExtArgs>>): Prisma__PropertyFavoriteClient<$Result.GetResult<Prisma.$PropertyFavoritePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PropertyFavorite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFavoriteFindFirstOrThrowArgs} args - Arguments to find a PropertyFavorite
     * @example
     * // Get one PropertyFavorite
     * const propertyFavorite = await prisma.propertyFavorite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PropertyFavoriteFindFirstOrThrowArgs>(args?: SelectSubset<T, PropertyFavoriteFindFirstOrThrowArgs<ExtArgs>>): Prisma__PropertyFavoriteClient<$Result.GetResult<Prisma.$PropertyFavoritePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PropertyFavorites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFavoriteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PropertyFavorites
     * const propertyFavorites = await prisma.propertyFavorite.findMany()
     * 
     * // Get first 10 PropertyFavorites
     * const propertyFavorites = await prisma.propertyFavorite.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const propertyFavoriteWithIdOnly = await prisma.propertyFavorite.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PropertyFavoriteFindManyArgs>(args?: SelectSubset<T, PropertyFavoriteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyFavoritePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PropertyFavorite.
     * @param {PropertyFavoriteCreateArgs} args - Arguments to create a PropertyFavorite.
     * @example
     * // Create one PropertyFavorite
     * const PropertyFavorite = await prisma.propertyFavorite.create({
     *   data: {
     *     // ... data to create a PropertyFavorite
     *   }
     * })
     * 
     */
    create<T extends PropertyFavoriteCreateArgs>(args: SelectSubset<T, PropertyFavoriteCreateArgs<ExtArgs>>): Prisma__PropertyFavoriteClient<$Result.GetResult<Prisma.$PropertyFavoritePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PropertyFavorites.
     * @param {PropertyFavoriteCreateManyArgs} args - Arguments to create many PropertyFavorites.
     * @example
     * // Create many PropertyFavorites
     * const propertyFavorite = await prisma.propertyFavorite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PropertyFavoriteCreateManyArgs>(args?: SelectSubset<T, PropertyFavoriteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PropertyFavorites and returns the data saved in the database.
     * @param {PropertyFavoriteCreateManyAndReturnArgs} args - Arguments to create many PropertyFavorites.
     * @example
     * // Create many PropertyFavorites
     * const propertyFavorite = await prisma.propertyFavorite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PropertyFavorites and only return the `id`
     * const propertyFavoriteWithIdOnly = await prisma.propertyFavorite.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PropertyFavoriteCreateManyAndReturnArgs>(args?: SelectSubset<T, PropertyFavoriteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyFavoritePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PropertyFavorite.
     * @param {PropertyFavoriteDeleteArgs} args - Arguments to delete one PropertyFavorite.
     * @example
     * // Delete one PropertyFavorite
     * const PropertyFavorite = await prisma.propertyFavorite.delete({
     *   where: {
     *     // ... filter to delete one PropertyFavorite
     *   }
     * })
     * 
     */
    delete<T extends PropertyFavoriteDeleteArgs>(args: SelectSubset<T, PropertyFavoriteDeleteArgs<ExtArgs>>): Prisma__PropertyFavoriteClient<$Result.GetResult<Prisma.$PropertyFavoritePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PropertyFavorite.
     * @param {PropertyFavoriteUpdateArgs} args - Arguments to update one PropertyFavorite.
     * @example
     * // Update one PropertyFavorite
     * const propertyFavorite = await prisma.propertyFavorite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PropertyFavoriteUpdateArgs>(args: SelectSubset<T, PropertyFavoriteUpdateArgs<ExtArgs>>): Prisma__PropertyFavoriteClient<$Result.GetResult<Prisma.$PropertyFavoritePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PropertyFavorites.
     * @param {PropertyFavoriteDeleteManyArgs} args - Arguments to filter PropertyFavorites to delete.
     * @example
     * // Delete a few PropertyFavorites
     * const { count } = await prisma.propertyFavorite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PropertyFavoriteDeleteManyArgs>(args?: SelectSubset<T, PropertyFavoriteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PropertyFavorites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFavoriteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PropertyFavorites
     * const propertyFavorite = await prisma.propertyFavorite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PropertyFavoriteUpdateManyArgs>(args: SelectSubset<T, PropertyFavoriteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PropertyFavorites and returns the data updated in the database.
     * @param {PropertyFavoriteUpdateManyAndReturnArgs} args - Arguments to update many PropertyFavorites.
     * @example
     * // Update many PropertyFavorites
     * const propertyFavorite = await prisma.propertyFavorite.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PropertyFavorites and only return the `id`
     * const propertyFavoriteWithIdOnly = await prisma.propertyFavorite.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PropertyFavoriteUpdateManyAndReturnArgs>(args: SelectSubset<T, PropertyFavoriteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyFavoritePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PropertyFavorite.
     * @param {PropertyFavoriteUpsertArgs} args - Arguments to update or create a PropertyFavorite.
     * @example
     * // Update or create a PropertyFavorite
     * const propertyFavorite = await prisma.propertyFavorite.upsert({
     *   create: {
     *     // ... data to create a PropertyFavorite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PropertyFavorite we want to update
     *   }
     * })
     */
    upsert<T extends PropertyFavoriteUpsertArgs>(args: SelectSubset<T, PropertyFavoriteUpsertArgs<ExtArgs>>): Prisma__PropertyFavoriteClient<$Result.GetResult<Prisma.$PropertyFavoritePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PropertyFavorites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFavoriteCountArgs} args - Arguments to filter PropertyFavorites to count.
     * @example
     * // Count the number of PropertyFavorites
     * const count = await prisma.propertyFavorite.count({
     *   where: {
     *     // ... the filter for the PropertyFavorites we want to count
     *   }
     * })
    **/
    count<T extends PropertyFavoriteCountArgs>(
      args?: Subset<T, PropertyFavoriteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PropertyFavoriteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PropertyFavorite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFavoriteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PropertyFavoriteAggregateArgs>(args: Subset<T, PropertyFavoriteAggregateArgs>): Prisma.PrismaPromise<GetPropertyFavoriteAggregateType<T>>

    /**
     * Group by PropertyFavorite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFavoriteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PropertyFavoriteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PropertyFavoriteGroupByArgs['orderBy'] }
        : { orderBy?: PropertyFavoriteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PropertyFavoriteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPropertyFavoriteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PropertyFavorite model
   */
  readonly fields: PropertyFavoriteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PropertyFavorite.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PropertyFavoriteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PropertyFavorite model
   */
  interface PropertyFavoriteFieldRefs {
    readonly id: FieldRef<"PropertyFavorite", 'String'>
    readonly propertyId: FieldRef<"PropertyFavorite", 'String'>
    readonly userId: FieldRef<"PropertyFavorite", 'String'>
    readonly createdAt: FieldRef<"PropertyFavorite", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PropertyFavorite findUnique
   */
  export type PropertyFavoriteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyFavorite
     */
    select?: PropertyFavoriteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyFavorite
     */
    omit?: PropertyFavoriteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyFavoriteInclude<ExtArgs> | null
    /**
     * Filter, which PropertyFavorite to fetch.
     */
    where: PropertyFavoriteWhereUniqueInput
  }

  /**
   * PropertyFavorite findUniqueOrThrow
   */
  export type PropertyFavoriteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyFavorite
     */
    select?: PropertyFavoriteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyFavorite
     */
    omit?: PropertyFavoriteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyFavoriteInclude<ExtArgs> | null
    /**
     * Filter, which PropertyFavorite to fetch.
     */
    where: PropertyFavoriteWhereUniqueInput
  }

  /**
   * PropertyFavorite findFirst
   */
  export type PropertyFavoriteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyFavorite
     */
    select?: PropertyFavoriteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyFavorite
     */
    omit?: PropertyFavoriteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyFavoriteInclude<ExtArgs> | null
    /**
     * Filter, which PropertyFavorite to fetch.
     */
    where?: PropertyFavoriteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertyFavorites to fetch.
     */
    orderBy?: PropertyFavoriteOrderByWithRelationInput | PropertyFavoriteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PropertyFavorites.
     */
    cursor?: PropertyFavoriteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertyFavorites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertyFavorites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PropertyFavorites.
     */
    distinct?: PropertyFavoriteScalarFieldEnum | PropertyFavoriteScalarFieldEnum[]
  }

  /**
   * PropertyFavorite findFirstOrThrow
   */
  export type PropertyFavoriteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyFavorite
     */
    select?: PropertyFavoriteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyFavorite
     */
    omit?: PropertyFavoriteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyFavoriteInclude<ExtArgs> | null
    /**
     * Filter, which PropertyFavorite to fetch.
     */
    where?: PropertyFavoriteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertyFavorites to fetch.
     */
    orderBy?: PropertyFavoriteOrderByWithRelationInput | PropertyFavoriteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PropertyFavorites.
     */
    cursor?: PropertyFavoriteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertyFavorites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertyFavorites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PropertyFavorites.
     */
    distinct?: PropertyFavoriteScalarFieldEnum | PropertyFavoriteScalarFieldEnum[]
  }

  /**
   * PropertyFavorite findMany
   */
  export type PropertyFavoriteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyFavorite
     */
    select?: PropertyFavoriteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyFavorite
     */
    omit?: PropertyFavoriteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyFavoriteInclude<ExtArgs> | null
    /**
     * Filter, which PropertyFavorites to fetch.
     */
    where?: PropertyFavoriteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertyFavorites to fetch.
     */
    orderBy?: PropertyFavoriteOrderByWithRelationInput | PropertyFavoriteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PropertyFavorites.
     */
    cursor?: PropertyFavoriteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertyFavorites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertyFavorites.
     */
    skip?: number
    distinct?: PropertyFavoriteScalarFieldEnum | PropertyFavoriteScalarFieldEnum[]
  }

  /**
   * PropertyFavorite create
   */
  export type PropertyFavoriteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyFavorite
     */
    select?: PropertyFavoriteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyFavorite
     */
    omit?: PropertyFavoriteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyFavoriteInclude<ExtArgs> | null
    /**
     * The data needed to create a PropertyFavorite.
     */
    data: XOR<PropertyFavoriteCreateInput, PropertyFavoriteUncheckedCreateInput>
  }

  /**
   * PropertyFavorite createMany
   */
  export type PropertyFavoriteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PropertyFavorites.
     */
    data: PropertyFavoriteCreateManyInput | PropertyFavoriteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PropertyFavorite createManyAndReturn
   */
  export type PropertyFavoriteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyFavorite
     */
    select?: PropertyFavoriteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyFavorite
     */
    omit?: PropertyFavoriteOmit<ExtArgs> | null
    /**
     * The data used to create many PropertyFavorites.
     */
    data: PropertyFavoriteCreateManyInput | PropertyFavoriteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyFavoriteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PropertyFavorite update
   */
  export type PropertyFavoriteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyFavorite
     */
    select?: PropertyFavoriteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyFavorite
     */
    omit?: PropertyFavoriteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyFavoriteInclude<ExtArgs> | null
    /**
     * The data needed to update a PropertyFavorite.
     */
    data: XOR<PropertyFavoriteUpdateInput, PropertyFavoriteUncheckedUpdateInput>
    /**
     * Choose, which PropertyFavorite to update.
     */
    where: PropertyFavoriteWhereUniqueInput
  }

  /**
   * PropertyFavorite updateMany
   */
  export type PropertyFavoriteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PropertyFavorites.
     */
    data: XOR<PropertyFavoriteUpdateManyMutationInput, PropertyFavoriteUncheckedUpdateManyInput>
    /**
     * Filter which PropertyFavorites to update
     */
    where?: PropertyFavoriteWhereInput
    /**
     * Limit how many PropertyFavorites to update.
     */
    limit?: number
  }

  /**
   * PropertyFavorite updateManyAndReturn
   */
  export type PropertyFavoriteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyFavorite
     */
    select?: PropertyFavoriteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyFavorite
     */
    omit?: PropertyFavoriteOmit<ExtArgs> | null
    /**
     * The data used to update PropertyFavorites.
     */
    data: XOR<PropertyFavoriteUpdateManyMutationInput, PropertyFavoriteUncheckedUpdateManyInput>
    /**
     * Filter which PropertyFavorites to update
     */
    where?: PropertyFavoriteWhereInput
    /**
     * Limit how many PropertyFavorites to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyFavoriteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PropertyFavorite upsert
   */
  export type PropertyFavoriteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyFavorite
     */
    select?: PropertyFavoriteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyFavorite
     */
    omit?: PropertyFavoriteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyFavoriteInclude<ExtArgs> | null
    /**
     * The filter to search for the PropertyFavorite to update in case it exists.
     */
    where: PropertyFavoriteWhereUniqueInput
    /**
     * In case the PropertyFavorite found by the `where` argument doesn't exist, create a new PropertyFavorite with this data.
     */
    create: XOR<PropertyFavoriteCreateInput, PropertyFavoriteUncheckedCreateInput>
    /**
     * In case the PropertyFavorite was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PropertyFavoriteUpdateInput, PropertyFavoriteUncheckedUpdateInput>
  }

  /**
   * PropertyFavorite delete
   */
  export type PropertyFavoriteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyFavorite
     */
    select?: PropertyFavoriteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyFavorite
     */
    omit?: PropertyFavoriteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyFavoriteInclude<ExtArgs> | null
    /**
     * Filter which PropertyFavorite to delete.
     */
    where: PropertyFavoriteWhereUniqueInput
  }

  /**
   * PropertyFavorite deleteMany
   */
  export type PropertyFavoriteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PropertyFavorites to delete
     */
    where?: PropertyFavoriteWhereInput
    /**
     * Limit how many PropertyFavorites to delete.
     */
    limit?: number
  }

  /**
   * PropertyFavorite without action
   */
  export type PropertyFavoriteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyFavorite
     */
    select?: PropertyFavoriteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertyFavorite
     */
    omit?: PropertyFavoriteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyFavoriteInclude<ExtArgs> | null
  }


  /**
   * Model PropertySettings
   */

  export type AggregatePropertySettings = {
    _count: PropertySettingsCountAggregateOutputType | null
    _avg: PropertySettingsAvgAggregateOutputType | null
    _sum: PropertySettingsSumAggregateOutputType | null
    _min: PropertySettingsMinAggregateOutputType | null
    _max: PropertySettingsMaxAggregateOutputType | null
  }

  export type PropertySettingsAvgAggregateOutputType = {
    maxImagesPerProperty: number | null
    maxFeaturesPerProperty: number | null
    minPrice: Decimal | null
    maxPrice: Decimal | null
    minArea: Decimal | null
    maxArea: Decimal | null
  }

  export type PropertySettingsSumAggregateOutputType = {
    maxImagesPerProperty: number | null
    maxFeaturesPerProperty: number | null
    minPrice: Decimal | null
    maxPrice: Decimal | null
    minArea: Decimal | null
    maxArea: Decimal | null
  }

  export type PropertySettingsMinAggregateOutputType = {
    id: string | null
    maxImagesPerProperty: number | null
    maxFeaturesPerProperty: number | null
    defaultCurrency: string | null
    defaultStatus: $Enums.PropertyStatus | null
    minPrice: Decimal | null
    maxPrice: Decimal | null
    minArea: Decimal | null
    maxArea: Decimal | null
    updatedAt: Date | null
    updatedBy: string | null
  }

  export type PropertySettingsMaxAggregateOutputType = {
    id: string | null
    maxImagesPerProperty: number | null
    maxFeaturesPerProperty: number | null
    defaultCurrency: string | null
    defaultStatus: $Enums.PropertyStatus | null
    minPrice: Decimal | null
    maxPrice: Decimal | null
    minArea: Decimal | null
    maxArea: Decimal | null
    updatedAt: Date | null
    updatedBy: string | null
  }

  export type PropertySettingsCountAggregateOutputType = {
    id: number
    maxImagesPerProperty: number
    maxFeaturesPerProperty: number
    defaultCurrency: number
    defaultStatus: number
    minPrice: number
    maxPrice: number
    minArea: number
    maxArea: number
    updatedAt: number
    updatedBy: number
    _all: number
  }


  export type PropertySettingsAvgAggregateInputType = {
    maxImagesPerProperty?: true
    maxFeaturesPerProperty?: true
    minPrice?: true
    maxPrice?: true
    minArea?: true
    maxArea?: true
  }

  export type PropertySettingsSumAggregateInputType = {
    maxImagesPerProperty?: true
    maxFeaturesPerProperty?: true
    minPrice?: true
    maxPrice?: true
    minArea?: true
    maxArea?: true
  }

  export type PropertySettingsMinAggregateInputType = {
    id?: true
    maxImagesPerProperty?: true
    maxFeaturesPerProperty?: true
    defaultCurrency?: true
    defaultStatus?: true
    minPrice?: true
    maxPrice?: true
    minArea?: true
    maxArea?: true
    updatedAt?: true
    updatedBy?: true
  }

  export type PropertySettingsMaxAggregateInputType = {
    id?: true
    maxImagesPerProperty?: true
    maxFeaturesPerProperty?: true
    defaultCurrency?: true
    defaultStatus?: true
    minPrice?: true
    maxPrice?: true
    minArea?: true
    maxArea?: true
    updatedAt?: true
    updatedBy?: true
  }

  export type PropertySettingsCountAggregateInputType = {
    id?: true
    maxImagesPerProperty?: true
    maxFeaturesPerProperty?: true
    defaultCurrency?: true
    defaultStatus?: true
    minPrice?: true
    maxPrice?: true
    minArea?: true
    maxArea?: true
    updatedAt?: true
    updatedBy?: true
    _all?: true
  }

  export type PropertySettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PropertySettings to aggregate.
     */
    where?: PropertySettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertySettings to fetch.
     */
    orderBy?: PropertySettingsOrderByWithRelationInput | PropertySettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PropertySettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PropertySettings
    **/
    _count?: true | PropertySettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PropertySettingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PropertySettingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PropertySettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PropertySettingsMaxAggregateInputType
  }

  export type GetPropertySettingsAggregateType<T extends PropertySettingsAggregateArgs> = {
        [P in keyof T & keyof AggregatePropertySettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePropertySettings[P]>
      : GetScalarType<T[P], AggregatePropertySettings[P]>
  }




  export type PropertySettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertySettingsWhereInput
    orderBy?: PropertySettingsOrderByWithAggregationInput | PropertySettingsOrderByWithAggregationInput[]
    by: PropertySettingsScalarFieldEnum[] | PropertySettingsScalarFieldEnum
    having?: PropertySettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PropertySettingsCountAggregateInputType | true
    _avg?: PropertySettingsAvgAggregateInputType
    _sum?: PropertySettingsSumAggregateInputType
    _min?: PropertySettingsMinAggregateInputType
    _max?: PropertySettingsMaxAggregateInputType
  }

  export type PropertySettingsGroupByOutputType = {
    id: string
    maxImagesPerProperty: number
    maxFeaturesPerProperty: number
    defaultCurrency: string
    defaultStatus: $Enums.PropertyStatus
    minPrice: Decimal | null
    maxPrice: Decimal | null
    minArea: Decimal | null
    maxArea: Decimal | null
    updatedAt: Date
    updatedBy: string | null
    _count: PropertySettingsCountAggregateOutputType | null
    _avg: PropertySettingsAvgAggregateOutputType | null
    _sum: PropertySettingsSumAggregateOutputType | null
    _min: PropertySettingsMinAggregateOutputType | null
    _max: PropertySettingsMaxAggregateOutputType | null
  }

  type GetPropertySettingsGroupByPayload<T extends PropertySettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PropertySettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PropertySettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PropertySettingsGroupByOutputType[P]>
            : GetScalarType<T[P], PropertySettingsGroupByOutputType[P]>
        }
      >
    >


  export type PropertySettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    maxImagesPerProperty?: boolean
    maxFeaturesPerProperty?: boolean
    defaultCurrency?: boolean
    defaultStatus?: boolean
    minPrice?: boolean
    maxPrice?: boolean
    minArea?: boolean
    maxArea?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
  }, ExtArgs["result"]["propertySettings"]>

  export type PropertySettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    maxImagesPerProperty?: boolean
    maxFeaturesPerProperty?: boolean
    defaultCurrency?: boolean
    defaultStatus?: boolean
    minPrice?: boolean
    maxPrice?: boolean
    minArea?: boolean
    maxArea?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
  }, ExtArgs["result"]["propertySettings"]>

  export type PropertySettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    maxImagesPerProperty?: boolean
    maxFeaturesPerProperty?: boolean
    defaultCurrency?: boolean
    defaultStatus?: boolean
    minPrice?: boolean
    maxPrice?: boolean
    minArea?: boolean
    maxArea?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
  }, ExtArgs["result"]["propertySettings"]>

  export type PropertySettingsSelectScalar = {
    id?: boolean
    maxImagesPerProperty?: boolean
    maxFeaturesPerProperty?: boolean
    defaultCurrency?: boolean
    defaultStatus?: boolean
    minPrice?: boolean
    maxPrice?: boolean
    minArea?: boolean
    maxArea?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
  }

  export type PropertySettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "maxImagesPerProperty" | "maxFeaturesPerProperty" | "defaultCurrency" | "defaultStatus" | "minPrice" | "maxPrice" | "minArea" | "maxArea" | "updatedAt" | "updatedBy", ExtArgs["result"]["propertySettings"]>

  export type $PropertySettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PropertySettings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      maxImagesPerProperty: number
      maxFeaturesPerProperty: number
      defaultCurrency: string
      defaultStatus: $Enums.PropertyStatus
      minPrice: Prisma.Decimal | null
      maxPrice: Prisma.Decimal | null
      minArea: Prisma.Decimal | null
      maxArea: Prisma.Decimal | null
      updatedAt: Date
      updatedBy: string | null
    }, ExtArgs["result"]["propertySettings"]>
    composites: {}
  }

  type PropertySettingsGetPayload<S extends boolean | null | undefined | PropertySettingsDefaultArgs> = $Result.GetResult<Prisma.$PropertySettingsPayload, S>

  type PropertySettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PropertySettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PropertySettingsCountAggregateInputType | true
    }

  export interface PropertySettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PropertySettings'], meta: { name: 'PropertySettings' } }
    /**
     * Find zero or one PropertySettings that matches the filter.
     * @param {PropertySettingsFindUniqueArgs} args - Arguments to find a PropertySettings
     * @example
     * // Get one PropertySettings
     * const propertySettings = await prisma.propertySettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PropertySettingsFindUniqueArgs>(args: SelectSubset<T, PropertySettingsFindUniqueArgs<ExtArgs>>): Prisma__PropertySettingsClient<$Result.GetResult<Prisma.$PropertySettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PropertySettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PropertySettingsFindUniqueOrThrowArgs} args - Arguments to find a PropertySettings
     * @example
     * // Get one PropertySettings
     * const propertySettings = await prisma.propertySettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PropertySettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, PropertySettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PropertySettingsClient<$Result.GetResult<Prisma.$PropertySettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PropertySettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertySettingsFindFirstArgs} args - Arguments to find a PropertySettings
     * @example
     * // Get one PropertySettings
     * const propertySettings = await prisma.propertySettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PropertySettingsFindFirstArgs>(args?: SelectSubset<T, PropertySettingsFindFirstArgs<ExtArgs>>): Prisma__PropertySettingsClient<$Result.GetResult<Prisma.$PropertySettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PropertySettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertySettingsFindFirstOrThrowArgs} args - Arguments to find a PropertySettings
     * @example
     * // Get one PropertySettings
     * const propertySettings = await prisma.propertySettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PropertySettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, PropertySettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__PropertySettingsClient<$Result.GetResult<Prisma.$PropertySettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PropertySettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertySettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PropertySettings
     * const propertySettings = await prisma.propertySettings.findMany()
     * 
     * // Get first 10 PropertySettings
     * const propertySettings = await prisma.propertySettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const propertySettingsWithIdOnly = await prisma.propertySettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PropertySettingsFindManyArgs>(args?: SelectSubset<T, PropertySettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertySettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PropertySettings.
     * @param {PropertySettingsCreateArgs} args - Arguments to create a PropertySettings.
     * @example
     * // Create one PropertySettings
     * const PropertySettings = await prisma.propertySettings.create({
     *   data: {
     *     // ... data to create a PropertySettings
     *   }
     * })
     * 
     */
    create<T extends PropertySettingsCreateArgs>(args: SelectSubset<T, PropertySettingsCreateArgs<ExtArgs>>): Prisma__PropertySettingsClient<$Result.GetResult<Prisma.$PropertySettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PropertySettings.
     * @param {PropertySettingsCreateManyArgs} args - Arguments to create many PropertySettings.
     * @example
     * // Create many PropertySettings
     * const propertySettings = await prisma.propertySettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PropertySettingsCreateManyArgs>(args?: SelectSubset<T, PropertySettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PropertySettings and returns the data saved in the database.
     * @param {PropertySettingsCreateManyAndReturnArgs} args - Arguments to create many PropertySettings.
     * @example
     * // Create many PropertySettings
     * const propertySettings = await prisma.propertySettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PropertySettings and only return the `id`
     * const propertySettingsWithIdOnly = await prisma.propertySettings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PropertySettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, PropertySettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertySettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PropertySettings.
     * @param {PropertySettingsDeleteArgs} args - Arguments to delete one PropertySettings.
     * @example
     * // Delete one PropertySettings
     * const PropertySettings = await prisma.propertySettings.delete({
     *   where: {
     *     // ... filter to delete one PropertySettings
     *   }
     * })
     * 
     */
    delete<T extends PropertySettingsDeleteArgs>(args: SelectSubset<T, PropertySettingsDeleteArgs<ExtArgs>>): Prisma__PropertySettingsClient<$Result.GetResult<Prisma.$PropertySettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PropertySettings.
     * @param {PropertySettingsUpdateArgs} args - Arguments to update one PropertySettings.
     * @example
     * // Update one PropertySettings
     * const propertySettings = await prisma.propertySettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PropertySettingsUpdateArgs>(args: SelectSubset<T, PropertySettingsUpdateArgs<ExtArgs>>): Prisma__PropertySettingsClient<$Result.GetResult<Prisma.$PropertySettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PropertySettings.
     * @param {PropertySettingsDeleteManyArgs} args - Arguments to filter PropertySettings to delete.
     * @example
     * // Delete a few PropertySettings
     * const { count } = await prisma.propertySettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PropertySettingsDeleteManyArgs>(args?: SelectSubset<T, PropertySettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PropertySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertySettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PropertySettings
     * const propertySettings = await prisma.propertySettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PropertySettingsUpdateManyArgs>(args: SelectSubset<T, PropertySettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PropertySettings and returns the data updated in the database.
     * @param {PropertySettingsUpdateManyAndReturnArgs} args - Arguments to update many PropertySettings.
     * @example
     * // Update many PropertySettings
     * const propertySettings = await prisma.propertySettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PropertySettings and only return the `id`
     * const propertySettingsWithIdOnly = await prisma.propertySettings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PropertySettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, PropertySettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertySettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PropertySettings.
     * @param {PropertySettingsUpsertArgs} args - Arguments to update or create a PropertySettings.
     * @example
     * // Update or create a PropertySettings
     * const propertySettings = await prisma.propertySettings.upsert({
     *   create: {
     *     // ... data to create a PropertySettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PropertySettings we want to update
     *   }
     * })
     */
    upsert<T extends PropertySettingsUpsertArgs>(args: SelectSubset<T, PropertySettingsUpsertArgs<ExtArgs>>): Prisma__PropertySettingsClient<$Result.GetResult<Prisma.$PropertySettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PropertySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertySettingsCountArgs} args - Arguments to filter PropertySettings to count.
     * @example
     * // Count the number of PropertySettings
     * const count = await prisma.propertySettings.count({
     *   where: {
     *     // ... the filter for the PropertySettings we want to count
     *   }
     * })
    **/
    count<T extends PropertySettingsCountArgs>(
      args?: Subset<T, PropertySettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PropertySettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PropertySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertySettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PropertySettingsAggregateArgs>(args: Subset<T, PropertySettingsAggregateArgs>): Prisma.PrismaPromise<GetPropertySettingsAggregateType<T>>

    /**
     * Group by PropertySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertySettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PropertySettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PropertySettingsGroupByArgs['orderBy'] }
        : { orderBy?: PropertySettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PropertySettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPropertySettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PropertySettings model
   */
  readonly fields: PropertySettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PropertySettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PropertySettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PropertySettings model
   */
  interface PropertySettingsFieldRefs {
    readonly id: FieldRef<"PropertySettings", 'String'>
    readonly maxImagesPerProperty: FieldRef<"PropertySettings", 'Int'>
    readonly maxFeaturesPerProperty: FieldRef<"PropertySettings", 'Int'>
    readonly defaultCurrency: FieldRef<"PropertySettings", 'String'>
    readonly defaultStatus: FieldRef<"PropertySettings", 'PropertyStatus'>
    readonly minPrice: FieldRef<"PropertySettings", 'Decimal'>
    readonly maxPrice: FieldRef<"PropertySettings", 'Decimal'>
    readonly minArea: FieldRef<"PropertySettings", 'Decimal'>
    readonly maxArea: FieldRef<"PropertySettings", 'Decimal'>
    readonly updatedAt: FieldRef<"PropertySettings", 'DateTime'>
    readonly updatedBy: FieldRef<"PropertySettings", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PropertySettings findUnique
   */
  export type PropertySettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertySettings
     */
    select?: PropertySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertySettings
     */
    omit?: PropertySettingsOmit<ExtArgs> | null
    /**
     * Filter, which PropertySettings to fetch.
     */
    where: PropertySettingsWhereUniqueInput
  }

  /**
   * PropertySettings findUniqueOrThrow
   */
  export type PropertySettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertySettings
     */
    select?: PropertySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertySettings
     */
    omit?: PropertySettingsOmit<ExtArgs> | null
    /**
     * Filter, which PropertySettings to fetch.
     */
    where: PropertySettingsWhereUniqueInput
  }

  /**
   * PropertySettings findFirst
   */
  export type PropertySettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertySettings
     */
    select?: PropertySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertySettings
     */
    omit?: PropertySettingsOmit<ExtArgs> | null
    /**
     * Filter, which PropertySettings to fetch.
     */
    where?: PropertySettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertySettings to fetch.
     */
    orderBy?: PropertySettingsOrderByWithRelationInput | PropertySettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PropertySettings.
     */
    cursor?: PropertySettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PropertySettings.
     */
    distinct?: PropertySettingsScalarFieldEnum | PropertySettingsScalarFieldEnum[]
  }

  /**
   * PropertySettings findFirstOrThrow
   */
  export type PropertySettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertySettings
     */
    select?: PropertySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertySettings
     */
    omit?: PropertySettingsOmit<ExtArgs> | null
    /**
     * Filter, which PropertySettings to fetch.
     */
    where?: PropertySettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertySettings to fetch.
     */
    orderBy?: PropertySettingsOrderByWithRelationInput | PropertySettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PropertySettings.
     */
    cursor?: PropertySettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PropertySettings.
     */
    distinct?: PropertySettingsScalarFieldEnum | PropertySettingsScalarFieldEnum[]
  }

  /**
   * PropertySettings findMany
   */
  export type PropertySettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertySettings
     */
    select?: PropertySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertySettings
     */
    omit?: PropertySettingsOmit<ExtArgs> | null
    /**
     * Filter, which PropertySettings to fetch.
     */
    where?: PropertySettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PropertySettings to fetch.
     */
    orderBy?: PropertySettingsOrderByWithRelationInput | PropertySettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PropertySettings.
     */
    cursor?: PropertySettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PropertySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PropertySettings.
     */
    skip?: number
    distinct?: PropertySettingsScalarFieldEnum | PropertySettingsScalarFieldEnum[]
  }

  /**
   * PropertySettings create
   */
  export type PropertySettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertySettings
     */
    select?: PropertySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertySettings
     */
    omit?: PropertySettingsOmit<ExtArgs> | null
    /**
     * The data needed to create a PropertySettings.
     */
    data: XOR<PropertySettingsCreateInput, PropertySettingsUncheckedCreateInput>
  }

  /**
   * PropertySettings createMany
   */
  export type PropertySettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PropertySettings.
     */
    data: PropertySettingsCreateManyInput | PropertySettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PropertySettings createManyAndReturn
   */
  export type PropertySettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertySettings
     */
    select?: PropertySettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PropertySettings
     */
    omit?: PropertySettingsOmit<ExtArgs> | null
    /**
     * The data used to create many PropertySettings.
     */
    data: PropertySettingsCreateManyInput | PropertySettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PropertySettings update
   */
  export type PropertySettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertySettings
     */
    select?: PropertySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertySettings
     */
    omit?: PropertySettingsOmit<ExtArgs> | null
    /**
     * The data needed to update a PropertySettings.
     */
    data: XOR<PropertySettingsUpdateInput, PropertySettingsUncheckedUpdateInput>
    /**
     * Choose, which PropertySettings to update.
     */
    where: PropertySettingsWhereUniqueInput
  }

  /**
   * PropertySettings updateMany
   */
  export type PropertySettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PropertySettings.
     */
    data: XOR<PropertySettingsUpdateManyMutationInput, PropertySettingsUncheckedUpdateManyInput>
    /**
     * Filter which PropertySettings to update
     */
    where?: PropertySettingsWhereInput
    /**
     * Limit how many PropertySettings to update.
     */
    limit?: number
  }

  /**
   * PropertySettings updateManyAndReturn
   */
  export type PropertySettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertySettings
     */
    select?: PropertySettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PropertySettings
     */
    omit?: PropertySettingsOmit<ExtArgs> | null
    /**
     * The data used to update PropertySettings.
     */
    data: XOR<PropertySettingsUpdateManyMutationInput, PropertySettingsUncheckedUpdateManyInput>
    /**
     * Filter which PropertySettings to update
     */
    where?: PropertySettingsWhereInput
    /**
     * Limit how many PropertySettings to update.
     */
    limit?: number
  }

  /**
   * PropertySettings upsert
   */
  export type PropertySettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertySettings
     */
    select?: PropertySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertySettings
     */
    omit?: PropertySettingsOmit<ExtArgs> | null
    /**
     * The filter to search for the PropertySettings to update in case it exists.
     */
    where: PropertySettingsWhereUniqueInput
    /**
     * In case the PropertySettings found by the `where` argument doesn't exist, create a new PropertySettings with this data.
     */
    create: XOR<PropertySettingsCreateInput, PropertySettingsUncheckedCreateInput>
    /**
     * In case the PropertySettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PropertySettingsUpdateInput, PropertySettingsUncheckedUpdateInput>
  }

  /**
   * PropertySettings delete
   */
  export type PropertySettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertySettings
     */
    select?: PropertySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertySettings
     */
    omit?: PropertySettingsOmit<ExtArgs> | null
    /**
     * Filter which PropertySettings to delete.
     */
    where: PropertySettingsWhereUniqueInput
  }

  /**
   * PropertySettings deleteMany
   */
  export type PropertySettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PropertySettings to delete
     */
    where?: PropertySettingsWhereInput
    /**
     * Limit how many PropertySettings to delete.
     */
    limit?: number
  }

  /**
   * PropertySettings without action
   */
  export type PropertySettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertySettings
     */
    select?: PropertySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PropertySettings
     */
    omit?: PropertySettingsOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PropertyScalarFieldEnum: {
    id: 'id',
    title: 'title',
    location: 'location',
    price: 'price',
    status: 'status',
    adminStatus: 'adminStatus',
    type: 'type',
    imageUrl: 'imageUrl',
    description: 'description',
    bedrooms: 'bedrooms',
    bathrooms: 'bathrooms',
    area: 'area',
    yearBuilt: 'yearBuilt',
    coordinates: 'coordinates',
    garage: 'garage',
    pool: 'pool',
    energyRating: 'energyRating',
    views: 'views',
    features: 'features',
    contactPhone: 'contactPhone',
    contactEmail: 'contactEmail',
    ownerId: 'ownerId',
    agentId: 'agentId',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PropertyScalarFieldEnum = (typeof PropertyScalarFieldEnum)[keyof typeof PropertyScalarFieldEnum]


  export const PropertyImageScalarFieldEnum: {
    id: 'id',
    propertyId: 'propertyId',
    url: 'url',
    alt: 'alt',
    order: 'order',
    createdAt: 'createdAt'
  };

  export type PropertyImageScalarFieldEnum = (typeof PropertyImageScalarFieldEnum)[keyof typeof PropertyImageScalarFieldEnum]


  export const PriceHistoryScalarFieldEnum: {
    id: 'id',
    propertyId: 'propertyId',
    oldPrice: 'oldPrice',
    newPrice: 'newPrice',
    reason: 'reason',
    changedAt: 'changedAt',
    changedBy: 'changedBy'
  };

  export type PriceHistoryScalarFieldEnum = (typeof PriceHistoryScalarFieldEnum)[keyof typeof PriceHistoryScalarFieldEnum]


  export const PropertyVisitScalarFieldEnum: {
    id: 'id',
    propertyId: 'propertyId',
    visitorId: 'visitorId',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    visitedAt: 'visitedAt'
  };

  export type PropertyVisitScalarFieldEnum = (typeof PropertyVisitScalarFieldEnum)[keyof typeof PropertyVisitScalarFieldEnum]


  export const PropertyFavoriteScalarFieldEnum: {
    id: 'id',
    propertyId: 'propertyId',
    userId: 'userId',
    createdAt: 'createdAt'
  };

  export type PropertyFavoriteScalarFieldEnum = (typeof PropertyFavoriteScalarFieldEnum)[keyof typeof PropertyFavoriteScalarFieldEnum]


  export const PropertySettingsScalarFieldEnum: {
    id: 'id',
    maxImagesPerProperty: 'maxImagesPerProperty',
    maxFeaturesPerProperty: 'maxFeaturesPerProperty',
    defaultCurrency: 'defaultCurrency',
    defaultStatus: 'defaultStatus',
    minPrice: 'minPrice',
    maxPrice: 'maxPrice',
    minArea: 'minArea',
    maxArea: 'maxArea',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy'
  };

  export type PropertySettingsScalarFieldEnum = (typeof PropertySettingsScalarFieldEnum)[keyof typeof PropertySettingsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'PropertyStatus'
   */
  export type EnumPropertyStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PropertyStatus'>
    


  /**
   * Reference to a field of type 'PropertyStatus[]'
   */
  export type ListEnumPropertyStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PropertyStatus[]'>
    


  /**
   * Reference to a field of type 'AdminStatus'
   */
  export type EnumAdminStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AdminStatus'>
    


  /**
   * Reference to a field of type 'AdminStatus[]'
   */
  export type ListEnumAdminStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AdminStatus[]'>
    


  /**
   * Reference to a field of type 'PropertyType'
   */
  export type EnumPropertyTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PropertyType'>
    


  /**
   * Reference to a field of type 'PropertyType[]'
   */
  export type ListEnumPropertyTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PropertyType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type PropertyWhereInput = {
    AND?: PropertyWhereInput | PropertyWhereInput[]
    OR?: PropertyWhereInput[]
    NOT?: PropertyWhereInput | PropertyWhereInput[]
    id?: StringFilter<"Property"> | string
    title?: StringFilter<"Property"> | string
    location?: StringFilter<"Property"> | string
    price?: DecimalFilter<"Property"> | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusFilter<"Property"> | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusFilter<"Property"> | $Enums.AdminStatus
    type?: EnumPropertyTypeNullableFilter<"Property"> | $Enums.PropertyType | null
    imageUrl?: StringNullableFilter<"Property"> | string | null
    description?: StringNullableFilter<"Property"> | string | null
    bedrooms?: IntNullableFilter<"Property"> | number | null
    bathrooms?: IntNullableFilter<"Property"> | number | null
    area?: DecimalNullableFilter<"Property"> | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: IntNullableFilter<"Property"> | number | null
    coordinates?: JsonNullableFilter<"Property">
    garage?: BoolNullableFilter<"Property"> | boolean | null
    pool?: BoolNullableFilter<"Property"> | boolean | null
    energyRating?: StringNullableFilter<"Property"> | string | null
    views?: IntFilter<"Property"> | number
    features?: StringNullableListFilter<"Property">
    contactPhone?: StringNullableFilter<"Property"> | string | null
    contactEmail?: StringNullableFilter<"Property"> | string | null
    ownerId?: StringNullableFilter<"Property"> | string | null
    agentId?: StringNullableFilter<"Property"> | string | null
    createdBy?: StringNullableFilter<"Property"> | string | null
    updatedBy?: StringNullableFilter<"Property"> | string | null
    createdAt?: DateTimeFilter<"Property"> | Date | string
    updatedAt?: DateTimeFilter<"Property"> | Date | string
    images?: PropertyImageListRelationFilter
    visits?: PropertyVisitListRelationFilter
    favorites?: PropertyFavoriteListRelationFilter
    priceHistory?: PriceHistoryListRelationFilter
  }

  export type PropertyOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    location?: SortOrder
    price?: SortOrder
    status?: SortOrder
    adminStatus?: SortOrder
    type?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    bedrooms?: SortOrderInput | SortOrder
    bathrooms?: SortOrderInput | SortOrder
    area?: SortOrderInput | SortOrder
    yearBuilt?: SortOrderInput | SortOrder
    coordinates?: SortOrderInput | SortOrder
    garage?: SortOrderInput | SortOrder
    pool?: SortOrderInput | SortOrder
    energyRating?: SortOrderInput | SortOrder
    views?: SortOrder
    features?: SortOrder
    contactPhone?: SortOrderInput | SortOrder
    contactEmail?: SortOrderInput | SortOrder
    ownerId?: SortOrderInput | SortOrder
    agentId?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    images?: PropertyImageOrderByRelationAggregateInput
    visits?: PropertyVisitOrderByRelationAggregateInput
    favorites?: PropertyFavoriteOrderByRelationAggregateInput
    priceHistory?: PriceHistoryOrderByRelationAggregateInput
  }

  export type PropertyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PropertyWhereInput | PropertyWhereInput[]
    OR?: PropertyWhereInput[]
    NOT?: PropertyWhereInput | PropertyWhereInput[]
    title?: StringFilter<"Property"> | string
    location?: StringFilter<"Property"> | string
    price?: DecimalFilter<"Property"> | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusFilter<"Property"> | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusFilter<"Property"> | $Enums.AdminStatus
    type?: EnumPropertyTypeNullableFilter<"Property"> | $Enums.PropertyType | null
    imageUrl?: StringNullableFilter<"Property"> | string | null
    description?: StringNullableFilter<"Property"> | string | null
    bedrooms?: IntNullableFilter<"Property"> | number | null
    bathrooms?: IntNullableFilter<"Property"> | number | null
    area?: DecimalNullableFilter<"Property"> | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: IntNullableFilter<"Property"> | number | null
    coordinates?: JsonNullableFilter<"Property">
    garage?: BoolNullableFilter<"Property"> | boolean | null
    pool?: BoolNullableFilter<"Property"> | boolean | null
    energyRating?: StringNullableFilter<"Property"> | string | null
    views?: IntFilter<"Property"> | number
    features?: StringNullableListFilter<"Property">
    contactPhone?: StringNullableFilter<"Property"> | string | null
    contactEmail?: StringNullableFilter<"Property"> | string | null
    ownerId?: StringNullableFilter<"Property"> | string | null
    agentId?: StringNullableFilter<"Property"> | string | null
    createdBy?: StringNullableFilter<"Property"> | string | null
    updatedBy?: StringNullableFilter<"Property"> | string | null
    createdAt?: DateTimeFilter<"Property"> | Date | string
    updatedAt?: DateTimeFilter<"Property"> | Date | string
    images?: PropertyImageListRelationFilter
    visits?: PropertyVisitListRelationFilter
    favorites?: PropertyFavoriteListRelationFilter
    priceHistory?: PriceHistoryListRelationFilter
  }, "id">

  export type PropertyOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    location?: SortOrder
    price?: SortOrder
    status?: SortOrder
    adminStatus?: SortOrder
    type?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    bedrooms?: SortOrderInput | SortOrder
    bathrooms?: SortOrderInput | SortOrder
    area?: SortOrderInput | SortOrder
    yearBuilt?: SortOrderInput | SortOrder
    coordinates?: SortOrderInput | SortOrder
    garage?: SortOrderInput | SortOrder
    pool?: SortOrderInput | SortOrder
    energyRating?: SortOrderInput | SortOrder
    views?: SortOrder
    features?: SortOrder
    contactPhone?: SortOrderInput | SortOrder
    contactEmail?: SortOrderInput | SortOrder
    ownerId?: SortOrderInput | SortOrder
    agentId?: SortOrderInput | SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PropertyCountOrderByAggregateInput
    _avg?: PropertyAvgOrderByAggregateInput
    _max?: PropertyMaxOrderByAggregateInput
    _min?: PropertyMinOrderByAggregateInput
    _sum?: PropertySumOrderByAggregateInput
  }

  export type PropertyScalarWhereWithAggregatesInput = {
    AND?: PropertyScalarWhereWithAggregatesInput | PropertyScalarWhereWithAggregatesInput[]
    OR?: PropertyScalarWhereWithAggregatesInput[]
    NOT?: PropertyScalarWhereWithAggregatesInput | PropertyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Property"> | string
    title?: StringWithAggregatesFilter<"Property"> | string
    location?: StringWithAggregatesFilter<"Property"> | string
    price?: DecimalWithAggregatesFilter<"Property"> | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusWithAggregatesFilter<"Property"> | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusWithAggregatesFilter<"Property"> | $Enums.AdminStatus
    type?: EnumPropertyTypeNullableWithAggregatesFilter<"Property"> | $Enums.PropertyType | null
    imageUrl?: StringNullableWithAggregatesFilter<"Property"> | string | null
    description?: StringNullableWithAggregatesFilter<"Property"> | string | null
    bedrooms?: IntNullableWithAggregatesFilter<"Property"> | number | null
    bathrooms?: IntNullableWithAggregatesFilter<"Property"> | number | null
    area?: DecimalNullableWithAggregatesFilter<"Property"> | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: IntNullableWithAggregatesFilter<"Property"> | number | null
    coordinates?: JsonNullableWithAggregatesFilter<"Property">
    garage?: BoolNullableWithAggregatesFilter<"Property"> | boolean | null
    pool?: BoolNullableWithAggregatesFilter<"Property"> | boolean | null
    energyRating?: StringNullableWithAggregatesFilter<"Property"> | string | null
    views?: IntWithAggregatesFilter<"Property"> | number
    features?: StringNullableListFilter<"Property">
    contactPhone?: StringNullableWithAggregatesFilter<"Property"> | string | null
    contactEmail?: StringNullableWithAggregatesFilter<"Property"> | string | null
    ownerId?: StringNullableWithAggregatesFilter<"Property"> | string | null
    agentId?: StringNullableWithAggregatesFilter<"Property"> | string | null
    createdBy?: StringNullableWithAggregatesFilter<"Property"> | string | null
    updatedBy?: StringNullableWithAggregatesFilter<"Property"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Property"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Property"> | Date | string
  }

  export type PropertyImageWhereInput = {
    AND?: PropertyImageWhereInput | PropertyImageWhereInput[]
    OR?: PropertyImageWhereInput[]
    NOT?: PropertyImageWhereInput | PropertyImageWhereInput[]
    id?: StringFilter<"PropertyImage"> | string
    propertyId?: StringFilter<"PropertyImage"> | string
    url?: StringFilter<"PropertyImage"> | string
    alt?: StringNullableFilter<"PropertyImage"> | string | null
    order?: IntFilter<"PropertyImage"> | number
    createdAt?: DateTimeFilter<"PropertyImage"> | Date | string
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
  }

  export type PropertyImageOrderByWithRelationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    url?: SortOrder
    alt?: SortOrderInput | SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    property?: PropertyOrderByWithRelationInput
  }

  export type PropertyImageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PropertyImageWhereInput | PropertyImageWhereInput[]
    OR?: PropertyImageWhereInput[]
    NOT?: PropertyImageWhereInput | PropertyImageWhereInput[]
    propertyId?: StringFilter<"PropertyImage"> | string
    url?: StringFilter<"PropertyImage"> | string
    alt?: StringNullableFilter<"PropertyImage"> | string | null
    order?: IntFilter<"PropertyImage"> | number
    createdAt?: DateTimeFilter<"PropertyImage"> | Date | string
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
  }, "id">

  export type PropertyImageOrderByWithAggregationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    url?: SortOrder
    alt?: SortOrderInput | SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    _count?: PropertyImageCountOrderByAggregateInput
    _avg?: PropertyImageAvgOrderByAggregateInput
    _max?: PropertyImageMaxOrderByAggregateInput
    _min?: PropertyImageMinOrderByAggregateInput
    _sum?: PropertyImageSumOrderByAggregateInput
  }

  export type PropertyImageScalarWhereWithAggregatesInput = {
    AND?: PropertyImageScalarWhereWithAggregatesInput | PropertyImageScalarWhereWithAggregatesInput[]
    OR?: PropertyImageScalarWhereWithAggregatesInput[]
    NOT?: PropertyImageScalarWhereWithAggregatesInput | PropertyImageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PropertyImage"> | string
    propertyId?: StringWithAggregatesFilter<"PropertyImage"> | string
    url?: StringWithAggregatesFilter<"PropertyImage"> | string
    alt?: StringNullableWithAggregatesFilter<"PropertyImage"> | string | null
    order?: IntWithAggregatesFilter<"PropertyImage"> | number
    createdAt?: DateTimeWithAggregatesFilter<"PropertyImage"> | Date | string
  }

  export type PriceHistoryWhereInput = {
    AND?: PriceHistoryWhereInput | PriceHistoryWhereInput[]
    OR?: PriceHistoryWhereInput[]
    NOT?: PriceHistoryWhereInput | PriceHistoryWhereInput[]
    id?: StringFilter<"PriceHistory"> | string
    propertyId?: StringFilter<"PriceHistory"> | string
    oldPrice?: DecimalNullableFilter<"PriceHistory"> | Decimal | DecimalJsLike | number | string | null
    newPrice?: DecimalFilter<"PriceHistory"> | Decimal | DecimalJsLike | number | string
    reason?: StringNullableFilter<"PriceHistory"> | string | null
    changedAt?: DateTimeFilter<"PriceHistory"> | Date | string
    changedBy?: StringNullableFilter<"PriceHistory"> | string | null
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
  }

  export type PriceHistoryOrderByWithRelationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    oldPrice?: SortOrderInput | SortOrder
    newPrice?: SortOrder
    reason?: SortOrderInput | SortOrder
    changedAt?: SortOrder
    changedBy?: SortOrderInput | SortOrder
    property?: PropertyOrderByWithRelationInput
  }

  export type PriceHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PriceHistoryWhereInput | PriceHistoryWhereInput[]
    OR?: PriceHistoryWhereInput[]
    NOT?: PriceHistoryWhereInput | PriceHistoryWhereInput[]
    propertyId?: StringFilter<"PriceHistory"> | string
    oldPrice?: DecimalNullableFilter<"PriceHistory"> | Decimal | DecimalJsLike | number | string | null
    newPrice?: DecimalFilter<"PriceHistory"> | Decimal | DecimalJsLike | number | string
    reason?: StringNullableFilter<"PriceHistory"> | string | null
    changedAt?: DateTimeFilter<"PriceHistory"> | Date | string
    changedBy?: StringNullableFilter<"PriceHistory"> | string | null
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
  }, "id">

  export type PriceHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    oldPrice?: SortOrderInput | SortOrder
    newPrice?: SortOrder
    reason?: SortOrderInput | SortOrder
    changedAt?: SortOrder
    changedBy?: SortOrderInput | SortOrder
    _count?: PriceHistoryCountOrderByAggregateInput
    _avg?: PriceHistoryAvgOrderByAggregateInput
    _max?: PriceHistoryMaxOrderByAggregateInput
    _min?: PriceHistoryMinOrderByAggregateInput
    _sum?: PriceHistorySumOrderByAggregateInput
  }

  export type PriceHistoryScalarWhereWithAggregatesInput = {
    AND?: PriceHistoryScalarWhereWithAggregatesInput | PriceHistoryScalarWhereWithAggregatesInput[]
    OR?: PriceHistoryScalarWhereWithAggregatesInput[]
    NOT?: PriceHistoryScalarWhereWithAggregatesInput | PriceHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PriceHistory"> | string
    propertyId?: StringWithAggregatesFilter<"PriceHistory"> | string
    oldPrice?: DecimalNullableWithAggregatesFilter<"PriceHistory"> | Decimal | DecimalJsLike | number | string | null
    newPrice?: DecimalWithAggregatesFilter<"PriceHistory"> | Decimal | DecimalJsLike | number | string
    reason?: StringNullableWithAggregatesFilter<"PriceHistory"> | string | null
    changedAt?: DateTimeWithAggregatesFilter<"PriceHistory"> | Date | string
    changedBy?: StringNullableWithAggregatesFilter<"PriceHistory"> | string | null
  }

  export type PropertyVisitWhereInput = {
    AND?: PropertyVisitWhereInput | PropertyVisitWhereInput[]
    OR?: PropertyVisitWhereInput[]
    NOT?: PropertyVisitWhereInput | PropertyVisitWhereInput[]
    id?: StringFilter<"PropertyVisit"> | string
    propertyId?: StringFilter<"PropertyVisit"> | string
    visitorId?: StringNullableFilter<"PropertyVisit"> | string | null
    ipAddress?: StringFilter<"PropertyVisit"> | string
    userAgent?: StringNullableFilter<"PropertyVisit"> | string | null
    visitedAt?: DateTimeFilter<"PropertyVisit"> | Date | string
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
  }

  export type PropertyVisitOrderByWithRelationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    visitorId?: SortOrderInput | SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrderInput | SortOrder
    visitedAt?: SortOrder
    property?: PropertyOrderByWithRelationInput
  }

  export type PropertyVisitWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PropertyVisitWhereInput | PropertyVisitWhereInput[]
    OR?: PropertyVisitWhereInput[]
    NOT?: PropertyVisitWhereInput | PropertyVisitWhereInput[]
    propertyId?: StringFilter<"PropertyVisit"> | string
    visitorId?: StringNullableFilter<"PropertyVisit"> | string | null
    ipAddress?: StringFilter<"PropertyVisit"> | string
    userAgent?: StringNullableFilter<"PropertyVisit"> | string | null
    visitedAt?: DateTimeFilter<"PropertyVisit"> | Date | string
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
  }, "id">

  export type PropertyVisitOrderByWithAggregationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    visitorId?: SortOrderInput | SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrderInput | SortOrder
    visitedAt?: SortOrder
    _count?: PropertyVisitCountOrderByAggregateInput
    _max?: PropertyVisitMaxOrderByAggregateInput
    _min?: PropertyVisitMinOrderByAggregateInput
  }

  export type PropertyVisitScalarWhereWithAggregatesInput = {
    AND?: PropertyVisitScalarWhereWithAggregatesInput | PropertyVisitScalarWhereWithAggregatesInput[]
    OR?: PropertyVisitScalarWhereWithAggregatesInput[]
    NOT?: PropertyVisitScalarWhereWithAggregatesInput | PropertyVisitScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PropertyVisit"> | string
    propertyId?: StringWithAggregatesFilter<"PropertyVisit"> | string
    visitorId?: StringNullableWithAggregatesFilter<"PropertyVisit"> | string | null
    ipAddress?: StringWithAggregatesFilter<"PropertyVisit"> | string
    userAgent?: StringNullableWithAggregatesFilter<"PropertyVisit"> | string | null
    visitedAt?: DateTimeWithAggregatesFilter<"PropertyVisit"> | Date | string
  }

  export type PropertyFavoriteWhereInput = {
    AND?: PropertyFavoriteWhereInput | PropertyFavoriteWhereInput[]
    OR?: PropertyFavoriteWhereInput[]
    NOT?: PropertyFavoriteWhereInput | PropertyFavoriteWhereInput[]
    id?: StringFilter<"PropertyFavorite"> | string
    propertyId?: StringFilter<"PropertyFavorite"> | string
    userId?: StringFilter<"PropertyFavorite"> | string
    createdAt?: DateTimeFilter<"PropertyFavorite"> | Date | string
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
  }

  export type PropertyFavoriteOrderByWithRelationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    property?: PropertyOrderByWithRelationInput
  }

  export type PropertyFavoriteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    propertyId_userId?: PropertyFavoritePropertyIdUserIdCompoundUniqueInput
    AND?: PropertyFavoriteWhereInput | PropertyFavoriteWhereInput[]
    OR?: PropertyFavoriteWhereInput[]
    NOT?: PropertyFavoriteWhereInput | PropertyFavoriteWhereInput[]
    propertyId?: StringFilter<"PropertyFavorite"> | string
    userId?: StringFilter<"PropertyFavorite"> | string
    createdAt?: DateTimeFilter<"PropertyFavorite"> | Date | string
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
  }, "id" | "propertyId_userId">

  export type PropertyFavoriteOrderByWithAggregationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    _count?: PropertyFavoriteCountOrderByAggregateInput
    _max?: PropertyFavoriteMaxOrderByAggregateInput
    _min?: PropertyFavoriteMinOrderByAggregateInput
  }

  export type PropertyFavoriteScalarWhereWithAggregatesInput = {
    AND?: PropertyFavoriteScalarWhereWithAggregatesInput | PropertyFavoriteScalarWhereWithAggregatesInput[]
    OR?: PropertyFavoriteScalarWhereWithAggregatesInput[]
    NOT?: PropertyFavoriteScalarWhereWithAggregatesInput | PropertyFavoriteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PropertyFavorite"> | string
    propertyId?: StringWithAggregatesFilter<"PropertyFavorite"> | string
    userId?: StringWithAggregatesFilter<"PropertyFavorite"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PropertyFavorite"> | Date | string
  }

  export type PropertySettingsWhereInput = {
    AND?: PropertySettingsWhereInput | PropertySettingsWhereInput[]
    OR?: PropertySettingsWhereInput[]
    NOT?: PropertySettingsWhereInput | PropertySettingsWhereInput[]
    id?: StringFilter<"PropertySettings"> | string
    maxImagesPerProperty?: IntFilter<"PropertySettings"> | number
    maxFeaturesPerProperty?: IntFilter<"PropertySettings"> | number
    defaultCurrency?: StringFilter<"PropertySettings"> | string
    defaultStatus?: EnumPropertyStatusFilter<"PropertySettings"> | $Enums.PropertyStatus
    minPrice?: DecimalNullableFilter<"PropertySettings"> | Decimal | DecimalJsLike | number | string | null
    maxPrice?: DecimalNullableFilter<"PropertySettings"> | Decimal | DecimalJsLike | number | string | null
    minArea?: DecimalNullableFilter<"PropertySettings"> | Decimal | DecimalJsLike | number | string | null
    maxArea?: DecimalNullableFilter<"PropertySettings"> | Decimal | DecimalJsLike | number | string | null
    updatedAt?: DateTimeFilter<"PropertySettings"> | Date | string
    updatedBy?: StringNullableFilter<"PropertySettings"> | string | null
  }

  export type PropertySettingsOrderByWithRelationInput = {
    id?: SortOrder
    maxImagesPerProperty?: SortOrder
    maxFeaturesPerProperty?: SortOrder
    defaultCurrency?: SortOrder
    defaultStatus?: SortOrder
    minPrice?: SortOrderInput | SortOrder
    maxPrice?: SortOrderInput | SortOrder
    minArea?: SortOrderInput | SortOrder
    maxArea?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
  }

  export type PropertySettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PropertySettingsWhereInput | PropertySettingsWhereInput[]
    OR?: PropertySettingsWhereInput[]
    NOT?: PropertySettingsWhereInput | PropertySettingsWhereInput[]
    maxImagesPerProperty?: IntFilter<"PropertySettings"> | number
    maxFeaturesPerProperty?: IntFilter<"PropertySettings"> | number
    defaultCurrency?: StringFilter<"PropertySettings"> | string
    defaultStatus?: EnumPropertyStatusFilter<"PropertySettings"> | $Enums.PropertyStatus
    minPrice?: DecimalNullableFilter<"PropertySettings"> | Decimal | DecimalJsLike | number | string | null
    maxPrice?: DecimalNullableFilter<"PropertySettings"> | Decimal | DecimalJsLike | number | string | null
    minArea?: DecimalNullableFilter<"PropertySettings"> | Decimal | DecimalJsLike | number | string | null
    maxArea?: DecimalNullableFilter<"PropertySettings"> | Decimal | DecimalJsLike | number | string | null
    updatedAt?: DateTimeFilter<"PropertySettings"> | Date | string
    updatedBy?: StringNullableFilter<"PropertySettings"> | string | null
  }, "id">

  export type PropertySettingsOrderByWithAggregationInput = {
    id?: SortOrder
    maxImagesPerProperty?: SortOrder
    maxFeaturesPerProperty?: SortOrder
    defaultCurrency?: SortOrder
    defaultStatus?: SortOrder
    minPrice?: SortOrderInput | SortOrder
    maxPrice?: SortOrderInput | SortOrder
    minArea?: SortOrderInput | SortOrder
    maxArea?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
    _count?: PropertySettingsCountOrderByAggregateInput
    _avg?: PropertySettingsAvgOrderByAggregateInput
    _max?: PropertySettingsMaxOrderByAggregateInput
    _min?: PropertySettingsMinOrderByAggregateInput
    _sum?: PropertySettingsSumOrderByAggregateInput
  }

  export type PropertySettingsScalarWhereWithAggregatesInput = {
    AND?: PropertySettingsScalarWhereWithAggregatesInput | PropertySettingsScalarWhereWithAggregatesInput[]
    OR?: PropertySettingsScalarWhereWithAggregatesInput[]
    NOT?: PropertySettingsScalarWhereWithAggregatesInput | PropertySettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PropertySettings"> | string
    maxImagesPerProperty?: IntWithAggregatesFilter<"PropertySettings"> | number
    maxFeaturesPerProperty?: IntWithAggregatesFilter<"PropertySettings"> | number
    defaultCurrency?: StringWithAggregatesFilter<"PropertySettings"> | string
    defaultStatus?: EnumPropertyStatusWithAggregatesFilter<"PropertySettings"> | $Enums.PropertyStatus
    minPrice?: DecimalNullableWithAggregatesFilter<"PropertySettings"> | Decimal | DecimalJsLike | number | string | null
    maxPrice?: DecimalNullableWithAggregatesFilter<"PropertySettings"> | Decimal | DecimalJsLike | number | string | null
    minArea?: DecimalNullableWithAggregatesFilter<"PropertySettings"> | Decimal | DecimalJsLike | number | string | null
    maxArea?: DecimalNullableWithAggregatesFilter<"PropertySettings"> | Decimal | DecimalJsLike | number | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"PropertySettings"> | Date | string
    updatedBy?: StringNullableWithAggregatesFilter<"PropertySettings"> | string | null
  }

  export type PropertyCreateInput = {
    id?: string
    title: string
    location: string
    price: Decimal | DecimalJsLike | number | string
    status?: $Enums.PropertyStatus
    adminStatus?: $Enums.AdminStatus
    type?: $Enums.PropertyType | null
    imageUrl?: string | null
    description?: string | null
    bedrooms?: number | null
    bathrooms?: number | null
    area?: Decimal | DecimalJsLike | number | string | null
    yearBuilt?: number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: boolean | null
    pool?: boolean | null
    energyRating?: string | null
    views?: number
    features?: PropertyCreatefeaturesInput | string[]
    contactPhone?: string | null
    contactEmail?: string | null
    ownerId?: string | null
    agentId?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: PropertyImageCreateNestedManyWithoutPropertyInput
    visits?: PropertyVisitCreateNestedManyWithoutPropertyInput
    favorites?: PropertyFavoriteCreateNestedManyWithoutPropertyInput
    priceHistory?: PriceHistoryCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateInput = {
    id?: string
    title: string
    location: string
    price: Decimal | DecimalJsLike | number | string
    status?: $Enums.PropertyStatus
    adminStatus?: $Enums.AdminStatus
    type?: $Enums.PropertyType | null
    imageUrl?: string | null
    description?: string | null
    bedrooms?: number | null
    bathrooms?: number | null
    area?: Decimal | DecimalJsLike | number | string | null
    yearBuilt?: number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: boolean | null
    pool?: boolean | null
    energyRating?: string | null
    views?: number
    features?: PropertyCreatefeaturesInput | string[]
    contactPhone?: string | null
    contactEmail?: string | null
    ownerId?: string | null
    agentId?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: PropertyImageUncheckedCreateNestedManyWithoutPropertyInput
    visits?: PropertyVisitUncheckedCreateNestedManyWithoutPropertyInput
    favorites?: PropertyFavoriteUncheckedCreateNestedManyWithoutPropertyInput
    priceHistory?: PriceHistoryUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusFieldUpdateOperationsInput | $Enums.AdminStatus
    type?: NullableEnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: NullableIntFieldUpdateOperationsInput | number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pool?: NullableBoolFieldUpdateOperationsInput | boolean | null
    energyRating?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    features?: PropertyUpdatefeaturesInput | string[]
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: PropertyImageUpdateManyWithoutPropertyNestedInput
    visits?: PropertyVisitUpdateManyWithoutPropertyNestedInput
    favorites?: PropertyFavoriteUpdateManyWithoutPropertyNestedInput
    priceHistory?: PriceHistoryUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusFieldUpdateOperationsInput | $Enums.AdminStatus
    type?: NullableEnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: NullableIntFieldUpdateOperationsInput | number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pool?: NullableBoolFieldUpdateOperationsInput | boolean | null
    energyRating?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    features?: PropertyUpdatefeaturesInput | string[]
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: PropertyImageUncheckedUpdateManyWithoutPropertyNestedInput
    visits?: PropertyVisitUncheckedUpdateManyWithoutPropertyNestedInput
    favorites?: PropertyFavoriteUncheckedUpdateManyWithoutPropertyNestedInput
    priceHistory?: PriceHistoryUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyCreateManyInput = {
    id?: string
    title: string
    location: string
    price: Decimal | DecimalJsLike | number | string
    status?: $Enums.PropertyStatus
    adminStatus?: $Enums.AdminStatus
    type?: $Enums.PropertyType | null
    imageUrl?: string | null
    description?: string | null
    bedrooms?: number | null
    bathrooms?: number | null
    area?: Decimal | DecimalJsLike | number | string | null
    yearBuilt?: number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: boolean | null
    pool?: boolean | null
    energyRating?: string | null
    views?: number
    features?: PropertyCreatefeaturesInput | string[]
    contactPhone?: string | null
    contactEmail?: string | null
    ownerId?: string | null
    agentId?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PropertyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusFieldUpdateOperationsInput | $Enums.AdminStatus
    type?: NullableEnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: NullableIntFieldUpdateOperationsInput | number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pool?: NullableBoolFieldUpdateOperationsInput | boolean | null
    energyRating?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    features?: PropertyUpdatefeaturesInput | string[]
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusFieldUpdateOperationsInput | $Enums.AdminStatus
    type?: NullableEnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: NullableIntFieldUpdateOperationsInput | number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pool?: NullableBoolFieldUpdateOperationsInput | boolean | null
    energyRating?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    features?: PropertyUpdatefeaturesInput | string[]
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyImageCreateInput = {
    id?: string
    url: string
    alt?: string | null
    order?: number
    createdAt?: Date | string
    property: PropertyCreateNestedOneWithoutImagesInput
  }

  export type PropertyImageUncheckedCreateInput = {
    id?: string
    propertyId: string
    url: string
    alt?: string | null
    order?: number
    createdAt?: Date | string
  }

  export type PropertyImageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutImagesNestedInput
  }

  export type PropertyImageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyImageCreateManyInput = {
    id?: string
    propertyId: string
    url: string
    alt?: string | null
    order?: number
    createdAt?: Date | string
  }

  export type PropertyImageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyImageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceHistoryCreateInput = {
    id?: string
    oldPrice?: Decimal | DecimalJsLike | number | string | null
    newPrice: Decimal | DecimalJsLike | number | string
    reason?: string | null
    changedAt?: Date | string
    changedBy?: string | null
    property: PropertyCreateNestedOneWithoutPriceHistoryInput
  }

  export type PriceHistoryUncheckedCreateInput = {
    id?: string
    propertyId: string
    oldPrice?: Decimal | DecimalJsLike | number | string | null
    newPrice: Decimal | DecimalJsLike | number | string
    reason?: string | null
    changedAt?: Date | string
    changedBy?: string | null
  }

  export type PriceHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    oldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    newPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
    property?: PropertyUpdateOneRequiredWithoutPriceHistoryNestedInput
  }

  export type PriceHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    oldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    newPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PriceHistoryCreateManyInput = {
    id?: string
    propertyId: string
    oldPrice?: Decimal | DecimalJsLike | number | string | null
    newPrice: Decimal | DecimalJsLike | number | string
    reason?: string | null
    changedAt?: Date | string
    changedBy?: string | null
  }

  export type PriceHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    oldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    newPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PriceHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    oldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    newPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PropertyVisitCreateInput = {
    id?: string
    visitorId?: string | null
    ipAddress: string
    userAgent?: string | null
    visitedAt?: Date | string
    property: PropertyCreateNestedOneWithoutVisitsInput
  }

  export type PropertyVisitUncheckedCreateInput = {
    id?: string
    propertyId: string
    visitorId?: string | null
    ipAddress: string
    userAgent?: string | null
    visitedAt?: Date | string
  }

  export type PropertyVisitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitorId?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: StringFieldUpdateOperationsInput | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutVisitsNestedInput
  }

  export type PropertyVisitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    visitorId?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: StringFieldUpdateOperationsInput | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyVisitCreateManyInput = {
    id?: string
    propertyId: string
    visitorId?: string | null
    ipAddress: string
    userAgent?: string | null
    visitedAt?: Date | string
  }

  export type PropertyVisitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitorId?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: StringFieldUpdateOperationsInput | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyVisitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    visitorId?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: StringFieldUpdateOperationsInput | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyFavoriteCreateInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    property: PropertyCreateNestedOneWithoutFavoritesInput
  }

  export type PropertyFavoriteUncheckedCreateInput = {
    id?: string
    propertyId: string
    userId: string
    createdAt?: Date | string
  }

  export type PropertyFavoriteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutFavoritesNestedInput
  }

  export type PropertyFavoriteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyFavoriteCreateManyInput = {
    id?: string
    propertyId: string
    userId: string
    createdAt?: Date | string
  }

  export type PropertyFavoriteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyFavoriteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertySettingsCreateInput = {
    id?: string
    maxImagesPerProperty?: number
    maxFeaturesPerProperty?: number
    defaultCurrency?: string
    defaultStatus?: $Enums.PropertyStatus
    minPrice?: Decimal | DecimalJsLike | number | string | null
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    minArea?: Decimal | DecimalJsLike | number | string | null
    maxArea?: Decimal | DecimalJsLike | number | string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PropertySettingsUncheckedCreateInput = {
    id?: string
    maxImagesPerProperty?: number
    maxFeaturesPerProperty?: number
    defaultCurrency?: string
    defaultStatus?: $Enums.PropertyStatus
    minPrice?: Decimal | DecimalJsLike | number | string | null
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    minArea?: Decimal | DecimalJsLike | number | string | null
    maxArea?: Decimal | DecimalJsLike | number | string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PropertySettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    maxImagesPerProperty?: IntFieldUpdateOperationsInput | number
    maxFeaturesPerProperty?: IntFieldUpdateOperationsInput | number
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    defaultStatus?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    minPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minArea?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxArea?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PropertySettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    maxImagesPerProperty?: IntFieldUpdateOperationsInput | number
    maxFeaturesPerProperty?: IntFieldUpdateOperationsInput | number
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    defaultStatus?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    minPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minArea?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxArea?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PropertySettingsCreateManyInput = {
    id?: string
    maxImagesPerProperty?: number
    maxFeaturesPerProperty?: number
    defaultCurrency?: string
    defaultStatus?: $Enums.PropertyStatus
    minPrice?: Decimal | DecimalJsLike | number | string | null
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    minArea?: Decimal | DecimalJsLike | number | string | null
    maxArea?: Decimal | DecimalJsLike | number | string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PropertySettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    maxImagesPerProperty?: IntFieldUpdateOperationsInput | number
    maxFeaturesPerProperty?: IntFieldUpdateOperationsInput | number
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    defaultStatus?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    minPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minArea?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxArea?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PropertySettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    maxImagesPerProperty?: IntFieldUpdateOperationsInput | number
    maxFeaturesPerProperty?: IntFieldUpdateOperationsInput | number
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    defaultStatus?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    minPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minArea?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxArea?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type EnumPropertyStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyStatus | EnumPropertyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PropertyStatus[] | ListEnumPropertyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PropertyStatus[] | ListEnumPropertyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPropertyStatusFilter<$PrismaModel> | $Enums.PropertyStatus
  }

  export type EnumAdminStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminStatus | EnumAdminStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AdminStatus[] | ListEnumAdminStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminStatus[] | ListEnumAdminStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminStatusFilter<$PrismaModel> | $Enums.AdminStatus
  }

  export type EnumPropertyTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyType | EnumPropertyTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPropertyTypeNullableFilter<$PrismaModel> | $Enums.PropertyType | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PropertyImageListRelationFilter = {
    every?: PropertyImageWhereInput
    some?: PropertyImageWhereInput
    none?: PropertyImageWhereInput
  }

  export type PropertyVisitListRelationFilter = {
    every?: PropertyVisitWhereInput
    some?: PropertyVisitWhereInput
    none?: PropertyVisitWhereInput
  }

  export type PropertyFavoriteListRelationFilter = {
    every?: PropertyFavoriteWhereInput
    some?: PropertyFavoriteWhereInput
    none?: PropertyFavoriteWhereInput
  }

  export type PriceHistoryListRelationFilter = {
    every?: PriceHistoryWhereInput
    some?: PriceHistoryWhereInput
    none?: PriceHistoryWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PropertyImageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PropertyVisitOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PropertyFavoriteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PriceHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PropertyCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    location?: SortOrder
    price?: SortOrder
    status?: SortOrder
    adminStatus?: SortOrder
    type?: SortOrder
    imageUrl?: SortOrder
    description?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    area?: SortOrder
    yearBuilt?: SortOrder
    coordinates?: SortOrder
    garage?: SortOrder
    pool?: SortOrder
    energyRating?: SortOrder
    views?: SortOrder
    features?: SortOrder
    contactPhone?: SortOrder
    contactEmail?: SortOrder
    ownerId?: SortOrder
    agentId?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PropertyAvgOrderByAggregateInput = {
    price?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    area?: SortOrder
    yearBuilt?: SortOrder
    views?: SortOrder
  }

  export type PropertyMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    location?: SortOrder
    price?: SortOrder
    status?: SortOrder
    adminStatus?: SortOrder
    type?: SortOrder
    imageUrl?: SortOrder
    description?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    area?: SortOrder
    yearBuilt?: SortOrder
    garage?: SortOrder
    pool?: SortOrder
    energyRating?: SortOrder
    views?: SortOrder
    contactPhone?: SortOrder
    contactEmail?: SortOrder
    ownerId?: SortOrder
    agentId?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PropertyMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    location?: SortOrder
    price?: SortOrder
    status?: SortOrder
    adminStatus?: SortOrder
    type?: SortOrder
    imageUrl?: SortOrder
    description?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    area?: SortOrder
    yearBuilt?: SortOrder
    garage?: SortOrder
    pool?: SortOrder
    energyRating?: SortOrder
    views?: SortOrder
    contactPhone?: SortOrder
    contactEmail?: SortOrder
    ownerId?: SortOrder
    agentId?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PropertySumOrderByAggregateInput = {
    price?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    area?: SortOrder
    yearBuilt?: SortOrder
    views?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumPropertyStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyStatus | EnumPropertyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PropertyStatus[] | ListEnumPropertyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PropertyStatus[] | ListEnumPropertyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPropertyStatusWithAggregatesFilter<$PrismaModel> | $Enums.PropertyStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPropertyStatusFilter<$PrismaModel>
    _max?: NestedEnumPropertyStatusFilter<$PrismaModel>
  }

  export type EnumAdminStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminStatus | EnumAdminStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AdminStatus[] | ListEnumAdminStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminStatus[] | ListEnumAdminStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminStatusWithAggregatesFilter<$PrismaModel> | $Enums.AdminStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAdminStatusFilter<$PrismaModel>
    _max?: NestedEnumAdminStatusFilter<$PrismaModel>
  }

  export type EnumPropertyTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyType | EnumPropertyTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPropertyTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.PropertyType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPropertyTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumPropertyTypeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type PropertyScalarRelationFilter = {
    is?: PropertyWhereInput
    isNot?: PropertyWhereInput
  }

  export type PropertyImageCountOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    url?: SortOrder
    alt?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
  }

  export type PropertyImageAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type PropertyImageMaxOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    url?: SortOrder
    alt?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
  }

  export type PropertyImageMinOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    url?: SortOrder
    alt?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
  }

  export type PropertyImageSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type PriceHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    oldPrice?: SortOrder
    newPrice?: SortOrder
    reason?: SortOrder
    changedAt?: SortOrder
    changedBy?: SortOrder
  }

  export type PriceHistoryAvgOrderByAggregateInput = {
    oldPrice?: SortOrder
    newPrice?: SortOrder
  }

  export type PriceHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    oldPrice?: SortOrder
    newPrice?: SortOrder
    reason?: SortOrder
    changedAt?: SortOrder
    changedBy?: SortOrder
  }

  export type PriceHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    oldPrice?: SortOrder
    newPrice?: SortOrder
    reason?: SortOrder
    changedAt?: SortOrder
    changedBy?: SortOrder
  }

  export type PriceHistorySumOrderByAggregateInput = {
    oldPrice?: SortOrder
    newPrice?: SortOrder
  }

  export type PropertyVisitCountOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    visitorId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    visitedAt?: SortOrder
  }

  export type PropertyVisitMaxOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    visitorId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    visitedAt?: SortOrder
  }

  export type PropertyVisitMinOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    visitorId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    visitedAt?: SortOrder
  }

  export type PropertyFavoritePropertyIdUserIdCompoundUniqueInput = {
    propertyId: string
    userId: string
  }

  export type PropertyFavoriteCountOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type PropertyFavoriteMaxOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type PropertyFavoriteMinOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type PropertySettingsCountOrderByAggregateInput = {
    id?: SortOrder
    maxImagesPerProperty?: SortOrder
    maxFeaturesPerProperty?: SortOrder
    defaultCurrency?: SortOrder
    defaultStatus?: SortOrder
    minPrice?: SortOrder
    maxPrice?: SortOrder
    minArea?: SortOrder
    maxArea?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
  }

  export type PropertySettingsAvgOrderByAggregateInput = {
    maxImagesPerProperty?: SortOrder
    maxFeaturesPerProperty?: SortOrder
    minPrice?: SortOrder
    maxPrice?: SortOrder
    minArea?: SortOrder
    maxArea?: SortOrder
  }

  export type PropertySettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    maxImagesPerProperty?: SortOrder
    maxFeaturesPerProperty?: SortOrder
    defaultCurrency?: SortOrder
    defaultStatus?: SortOrder
    minPrice?: SortOrder
    maxPrice?: SortOrder
    minArea?: SortOrder
    maxArea?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
  }

  export type PropertySettingsMinOrderByAggregateInput = {
    id?: SortOrder
    maxImagesPerProperty?: SortOrder
    maxFeaturesPerProperty?: SortOrder
    defaultCurrency?: SortOrder
    defaultStatus?: SortOrder
    minPrice?: SortOrder
    maxPrice?: SortOrder
    minArea?: SortOrder
    maxArea?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
  }

  export type PropertySettingsSumOrderByAggregateInput = {
    maxImagesPerProperty?: SortOrder
    maxFeaturesPerProperty?: SortOrder
    minPrice?: SortOrder
    maxPrice?: SortOrder
    minArea?: SortOrder
    maxArea?: SortOrder
  }

  export type PropertyCreatefeaturesInput = {
    set: string[]
  }

  export type PropertyImageCreateNestedManyWithoutPropertyInput = {
    create?: XOR<PropertyImageCreateWithoutPropertyInput, PropertyImageUncheckedCreateWithoutPropertyInput> | PropertyImageCreateWithoutPropertyInput[] | PropertyImageUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PropertyImageCreateOrConnectWithoutPropertyInput | PropertyImageCreateOrConnectWithoutPropertyInput[]
    createMany?: PropertyImageCreateManyPropertyInputEnvelope
    connect?: PropertyImageWhereUniqueInput | PropertyImageWhereUniqueInput[]
  }

  export type PropertyVisitCreateNestedManyWithoutPropertyInput = {
    create?: XOR<PropertyVisitCreateWithoutPropertyInput, PropertyVisitUncheckedCreateWithoutPropertyInput> | PropertyVisitCreateWithoutPropertyInput[] | PropertyVisitUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PropertyVisitCreateOrConnectWithoutPropertyInput | PropertyVisitCreateOrConnectWithoutPropertyInput[]
    createMany?: PropertyVisitCreateManyPropertyInputEnvelope
    connect?: PropertyVisitWhereUniqueInput | PropertyVisitWhereUniqueInput[]
  }

  export type PropertyFavoriteCreateNestedManyWithoutPropertyInput = {
    create?: XOR<PropertyFavoriteCreateWithoutPropertyInput, PropertyFavoriteUncheckedCreateWithoutPropertyInput> | PropertyFavoriteCreateWithoutPropertyInput[] | PropertyFavoriteUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PropertyFavoriteCreateOrConnectWithoutPropertyInput | PropertyFavoriteCreateOrConnectWithoutPropertyInput[]
    createMany?: PropertyFavoriteCreateManyPropertyInputEnvelope
    connect?: PropertyFavoriteWhereUniqueInput | PropertyFavoriteWhereUniqueInput[]
  }

  export type PriceHistoryCreateNestedManyWithoutPropertyInput = {
    create?: XOR<PriceHistoryCreateWithoutPropertyInput, PriceHistoryUncheckedCreateWithoutPropertyInput> | PriceHistoryCreateWithoutPropertyInput[] | PriceHistoryUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PriceHistoryCreateOrConnectWithoutPropertyInput | PriceHistoryCreateOrConnectWithoutPropertyInput[]
    createMany?: PriceHistoryCreateManyPropertyInputEnvelope
    connect?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
  }

  export type PropertyImageUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<PropertyImageCreateWithoutPropertyInput, PropertyImageUncheckedCreateWithoutPropertyInput> | PropertyImageCreateWithoutPropertyInput[] | PropertyImageUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PropertyImageCreateOrConnectWithoutPropertyInput | PropertyImageCreateOrConnectWithoutPropertyInput[]
    createMany?: PropertyImageCreateManyPropertyInputEnvelope
    connect?: PropertyImageWhereUniqueInput | PropertyImageWhereUniqueInput[]
  }

  export type PropertyVisitUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<PropertyVisitCreateWithoutPropertyInput, PropertyVisitUncheckedCreateWithoutPropertyInput> | PropertyVisitCreateWithoutPropertyInput[] | PropertyVisitUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PropertyVisitCreateOrConnectWithoutPropertyInput | PropertyVisitCreateOrConnectWithoutPropertyInput[]
    createMany?: PropertyVisitCreateManyPropertyInputEnvelope
    connect?: PropertyVisitWhereUniqueInput | PropertyVisitWhereUniqueInput[]
  }

  export type PropertyFavoriteUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<PropertyFavoriteCreateWithoutPropertyInput, PropertyFavoriteUncheckedCreateWithoutPropertyInput> | PropertyFavoriteCreateWithoutPropertyInput[] | PropertyFavoriteUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PropertyFavoriteCreateOrConnectWithoutPropertyInput | PropertyFavoriteCreateOrConnectWithoutPropertyInput[]
    createMany?: PropertyFavoriteCreateManyPropertyInputEnvelope
    connect?: PropertyFavoriteWhereUniqueInput | PropertyFavoriteWhereUniqueInput[]
  }

  export type PriceHistoryUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<PriceHistoryCreateWithoutPropertyInput, PriceHistoryUncheckedCreateWithoutPropertyInput> | PriceHistoryCreateWithoutPropertyInput[] | PriceHistoryUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PriceHistoryCreateOrConnectWithoutPropertyInput | PriceHistoryCreateOrConnectWithoutPropertyInput[]
    createMany?: PriceHistoryCreateManyPropertyInputEnvelope
    connect?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumPropertyStatusFieldUpdateOperationsInput = {
    set?: $Enums.PropertyStatus
  }

  export type EnumAdminStatusFieldUpdateOperationsInput = {
    set?: $Enums.AdminStatus
  }

  export type NullableEnumPropertyTypeFieldUpdateOperationsInput = {
    set?: $Enums.PropertyType | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PropertyUpdatefeaturesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PropertyImageUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<PropertyImageCreateWithoutPropertyInput, PropertyImageUncheckedCreateWithoutPropertyInput> | PropertyImageCreateWithoutPropertyInput[] | PropertyImageUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PropertyImageCreateOrConnectWithoutPropertyInput | PropertyImageCreateOrConnectWithoutPropertyInput[]
    upsert?: PropertyImageUpsertWithWhereUniqueWithoutPropertyInput | PropertyImageUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: PropertyImageCreateManyPropertyInputEnvelope
    set?: PropertyImageWhereUniqueInput | PropertyImageWhereUniqueInput[]
    disconnect?: PropertyImageWhereUniqueInput | PropertyImageWhereUniqueInput[]
    delete?: PropertyImageWhereUniqueInput | PropertyImageWhereUniqueInput[]
    connect?: PropertyImageWhereUniqueInput | PropertyImageWhereUniqueInput[]
    update?: PropertyImageUpdateWithWhereUniqueWithoutPropertyInput | PropertyImageUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: PropertyImageUpdateManyWithWhereWithoutPropertyInput | PropertyImageUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: PropertyImageScalarWhereInput | PropertyImageScalarWhereInput[]
  }

  export type PropertyVisitUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<PropertyVisitCreateWithoutPropertyInput, PropertyVisitUncheckedCreateWithoutPropertyInput> | PropertyVisitCreateWithoutPropertyInput[] | PropertyVisitUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PropertyVisitCreateOrConnectWithoutPropertyInput | PropertyVisitCreateOrConnectWithoutPropertyInput[]
    upsert?: PropertyVisitUpsertWithWhereUniqueWithoutPropertyInput | PropertyVisitUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: PropertyVisitCreateManyPropertyInputEnvelope
    set?: PropertyVisitWhereUniqueInput | PropertyVisitWhereUniqueInput[]
    disconnect?: PropertyVisitWhereUniqueInput | PropertyVisitWhereUniqueInput[]
    delete?: PropertyVisitWhereUniqueInput | PropertyVisitWhereUniqueInput[]
    connect?: PropertyVisitWhereUniqueInput | PropertyVisitWhereUniqueInput[]
    update?: PropertyVisitUpdateWithWhereUniqueWithoutPropertyInput | PropertyVisitUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: PropertyVisitUpdateManyWithWhereWithoutPropertyInput | PropertyVisitUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: PropertyVisitScalarWhereInput | PropertyVisitScalarWhereInput[]
  }

  export type PropertyFavoriteUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<PropertyFavoriteCreateWithoutPropertyInput, PropertyFavoriteUncheckedCreateWithoutPropertyInput> | PropertyFavoriteCreateWithoutPropertyInput[] | PropertyFavoriteUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PropertyFavoriteCreateOrConnectWithoutPropertyInput | PropertyFavoriteCreateOrConnectWithoutPropertyInput[]
    upsert?: PropertyFavoriteUpsertWithWhereUniqueWithoutPropertyInput | PropertyFavoriteUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: PropertyFavoriteCreateManyPropertyInputEnvelope
    set?: PropertyFavoriteWhereUniqueInput | PropertyFavoriteWhereUniqueInput[]
    disconnect?: PropertyFavoriteWhereUniqueInput | PropertyFavoriteWhereUniqueInput[]
    delete?: PropertyFavoriteWhereUniqueInput | PropertyFavoriteWhereUniqueInput[]
    connect?: PropertyFavoriteWhereUniqueInput | PropertyFavoriteWhereUniqueInput[]
    update?: PropertyFavoriteUpdateWithWhereUniqueWithoutPropertyInput | PropertyFavoriteUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: PropertyFavoriteUpdateManyWithWhereWithoutPropertyInput | PropertyFavoriteUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: PropertyFavoriteScalarWhereInput | PropertyFavoriteScalarWhereInput[]
  }

  export type PriceHistoryUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<PriceHistoryCreateWithoutPropertyInput, PriceHistoryUncheckedCreateWithoutPropertyInput> | PriceHistoryCreateWithoutPropertyInput[] | PriceHistoryUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PriceHistoryCreateOrConnectWithoutPropertyInput | PriceHistoryCreateOrConnectWithoutPropertyInput[]
    upsert?: PriceHistoryUpsertWithWhereUniqueWithoutPropertyInput | PriceHistoryUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: PriceHistoryCreateManyPropertyInputEnvelope
    set?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    disconnect?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    delete?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    connect?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    update?: PriceHistoryUpdateWithWhereUniqueWithoutPropertyInput | PriceHistoryUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: PriceHistoryUpdateManyWithWhereWithoutPropertyInput | PriceHistoryUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: PriceHistoryScalarWhereInput | PriceHistoryScalarWhereInput[]
  }

  export type PropertyImageUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<PropertyImageCreateWithoutPropertyInput, PropertyImageUncheckedCreateWithoutPropertyInput> | PropertyImageCreateWithoutPropertyInput[] | PropertyImageUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PropertyImageCreateOrConnectWithoutPropertyInput | PropertyImageCreateOrConnectWithoutPropertyInput[]
    upsert?: PropertyImageUpsertWithWhereUniqueWithoutPropertyInput | PropertyImageUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: PropertyImageCreateManyPropertyInputEnvelope
    set?: PropertyImageWhereUniqueInput | PropertyImageWhereUniqueInput[]
    disconnect?: PropertyImageWhereUniqueInput | PropertyImageWhereUniqueInput[]
    delete?: PropertyImageWhereUniqueInput | PropertyImageWhereUniqueInput[]
    connect?: PropertyImageWhereUniqueInput | PropertyImageWhereUniqueInput[]
    update?: PropertyImageUpdateWithWhereUniqueWithoutPropertyInput | PropertyImageUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: PropertyImageUpdateManyWithWhereWithoutPropertyInput | PropertyImageUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: PropertyImageScalarWhereInput | PropertyImageScalarWhereInput[]
  }

  export type PropertyVisitUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<PropertyVisitCreateWithoutPropertyInput, PropertyVisitUncheckedCreateWithoutPropertyInput> | PropertyVisitCreateWithoutPropertyInput[] | PropertyVisitUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PropertyVisitCreateOrConnectWithoutPropertyInput | PropertyVisitCreateOrConnectWithoutPropertyInput[]
    upsert?: PropertyVisitUpsertWithWhereUniqueWithoutPropertyInput | PropertyVisitUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: PropertyVisitCreateManyPropertyInputEnvelope
    set?: PropertyVisitWhereUniqueInput | PropertyVisitWhereUniqueInput[]
    disconnect?: PropertyVisitWhereUniqueInput | PropertyVisitWhereUniqueInput[]
    delete?: PropertyVisitWhereUniqueInput | PropertyVisitWhereUniqueInput[]
    connect?: PropertyVisitWhereUniqueInput | PropertyVisitWhereUniqueInput[]
    update?: PropertyVisitUpdateWithWhereUniqueWithoutPropertyInput | PropertyVisitUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: PropertyVisitUpdateManyWithWhereWithoutPropertyInput | PropertyVisitUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: PropertyVisitScalarWhereInput | PropertyVisitScalarWhereInput[]
  }

  export type PropertyFavoriteUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<PropertyFavoriteCreateWithoutPropertyInput, PropertyFavoriteUncheckedCreateWithoutPropertyInput> | PropertyFavoriteCreateWithoutPropertyInput[] | PropertyFavoriteUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PropertyFavoriteCreateOrConnectWithoutPropertyInput | PropertyFavoriteCreateOrConnectWithoutPropertyInput[]
    upsert?: PropertyFavoriteUpsertWithWhereUniqueWithoutPropertyInput | PropertyFavoriteUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: PropertyFavoriteCreateManyPropertyInputEnvelope
    set?: PropertyFavoriteWhereUniqueInput | PropertyFavoriteWhereUniqueInput[]
    disconnect?: PropertyFavoriteWhereUniqueInput | PropertyFavoriteWhereUniqueInput[]
    delete?: PropertyFavoriteWhereUniqueInput | PropertyFavoriteWhereUniqueInput[]
    connect?: PropertyFavoriteWhereUniqueInput | PropertyFavoriteWhereUniqueInput[]
    update?: PropertyFavoriteUpdateWithWhereUniqueWithoutPropertyInput | PropertyFavoriteUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: PropertyFavoriteUpdateManyWithWhereWithoutPropertyInput | PropertyFavoriteUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: PropertyFavoriteScalarWhereInput | PropertyFavoriteScalarWhereInput[]
  }

  export type PriceHistoryUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<PriceHistoryCreateWithoutPropertyInput, PriceHistoryUncheckedCreateWithoutPropertyInput> | PriceHistoryCreateWithoutPropertyInput[] | PriceHistoryUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PriceHistoryCreateOrConnectWithoutPropertyInput | PriceHistoryCreateOrConnectWithoutPropertyInput[]
    upsert?: PriceHistoryUpsertWithWhereUniqueWithoutPropertyInput | PriceHistoryUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: PriceHistoryCreateManyPropertyInputEnvelope
    set?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    disconnect?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    delete?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    connect?: PriceHistoryWhereUniqueInput | PriceHistoryWhereUniqueInput[]
    update?: PriceHistoryUpdateWithWhereUniqueWithoutPropertyInput | PriceHistoryUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: PriceHistoryUpdateManyWithWhereWithoutPropertyInput | PriceHistoryUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: PriceHistoryScalarWhereInput | PriceHistoryScalarWhereInput[]
  }

  export type PropertyCreateNestedOneWithoutImagesInput = {
    create?: XOR<PropertyCreateWithoutImagesInput, PropertyUncheckedCreateWithoutImagesInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutImagesInput
    connect?: PropertyWhereUniqueInput
  }

  export type PropertyUpdateOneRequiredWithoutImagesNestedInput = {
    create?: XOR<PropertyCreateWithoutImagesInput, PropertyUncheckedCreateWithoutImagesInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutImagesInput
    upsert?: PropertyUpsertWithoutImagesInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutImagesInput, PropertyUpdateWithoutImagesInput>, PropertyUncheckedUpdateWithoutImagesInput>
  }

  export type PropertyCreateNestedOneWithoutPriceHistoryInput = {
    create?: XOR<PropertyCreateWithoutPriceHistoryInput, PropertyUncheckedCreateWithoutPriceHistoryInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutPriceHistoryInput
    connect?: PropertyWhereUniqueInput
  }

  export type PropertyUpdateOneRequiredWithoutPriceHistoryNestedInput = {
    create?: XOR<PropertyCreateWithoutPriceHistoryInput, PropertyUncheckedCreateWithoutPriceHistoryInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutPriceHistoryInput
    upsert?: PropertyUpsertWithoutPriceHistoryInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutPriceHistoryInput, PropertyUpdateWithoutPriceHistoryInput>, PropertyUncheckedUpdateWithoutPriceHistoryInput>
  }

  export type PropertyCreateNestedOneWithoutVisitsInput = {
    create?: XOR<PropertyCreateWithoutVisitsInput, PropertyUncheckedCreateWithoutVisitsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutVisitsInput
    connect?: PropertyWhereUniqueInput
  }

  export type PropertyUpdateOneRequiredWithoutVisitsNestedInput = {
    create?: XOR<PropertyCreateWithoutVisitsInput, PropertyUncheckedCreateWithoutVisitsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutVisitsInput
    upsert?: PropertyUpsertWithoutVisitsInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutVisitsInput, PropertyUpdateWithoutVisitsInput>, PropertyUncheckedUpdateWithoutVisitsInput>
  }

  export type PropertyCreateNestedOneWithoutFavoritesInput = {
    create?: XOR<PropertyCreateWithoutFavoritesInput, PropertyUncheckedCreateWithoutFavoritesInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutFavoritesInput
    connect?: PropertyWhereUniqueInput
  }

  export type PropertyUpdateOneRequiredWithoutFavoritesNestedInput = {
    create?: XOR<PropertyCreateWithoutFavoritesInput, PropertyUncheckedCreateWithoutFavoritesInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutFavoritesInput
    upsert?: PropertyUpsertWithoutFavoritesInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutFavoritesInput, PropertyUpdateWithoutFavoritesInput>, PropertyUncheckedUpdateWithoutFavoritesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumPropertyStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyStatus | EnumPropertyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PropertyStatus[] | ListEnumPropertyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PropertyStatus[] | ListEnumPropertyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPropertyStatusFilter<$PrismaModel> | $Enums.PropertyStatus
  }

  export type NestedEnumAdminStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminStatus | EnumAdminStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AdminStatus[] | ListEnumAdminStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminStatus[] | ListEnumAdminStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminStatusFilter<$PrismaModel> | $Enums.AdminStatus
  }

  export type NestedEnumPropertyTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyType | EnumPropertyTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPropertyTypeNullableFilter<$PrismaModel> | $Enums.PropertyType | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumPropertyStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyStatus | EnumPropertyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PropertyStatus[] | ListEnumPropertyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PropertyStatus[] | ListEnumPropertyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPropertyStatusWithAggregatesFilter<$PrismaModel> | $Enums.PropertyStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPropertyStatusFilter<$PrismaModel>
    _max?: NestedEnumPropertyStatusFilter<$PrismaModel>
  }

  export type NestedEnumAdminStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AdminStatus | EnumAdminStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AdminStatus[] | ListEnumAdminStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AdminStatus[] | ListEnumAdminStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAdminStatusWithAggregatesFilter<$PrismaModel> | $Enums.AdminStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAdminStatusFilter<$PrismaModel>
    _max?: NestedEnumAdminStatusFilter<$PrismaModel>
  }

  export type NestedEnumPropertyTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyType | EnumPropertyTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPropertyTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.PropertyType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPropertyTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumPropertyTypeNullableFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type PropertyImageCreateWithoutPropertyInput = {
    id?: string
    url: string
    alt?: string | null
    order?: number
    createdAt?: Date | string
  }

  export type PropertyImageUncheckedCreateWithoutPropertyInput = {
    id?: string
    url: string
    alt?: string | null
    order?: number
    createdAt?: Date | string
  }

  export type PropertyImageCreateOrConnectWithoutPropertyInput = {
    where: PropertyImageWhereUniqueInput
    create: XOR<PropertyImageCreateWithoutPropertyInput, PropertyImageUncheckedCreateWithoutPropertyInput>
  }

  export type PropertyImageCreateManyPropertyInputEnvelope = {
    data: PropertyImageCreateManyPropertyInput | PropertyImageCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type PropertyVisitCreateWithoutPropertyInput = {
    id?: string
    visitorId?: string | null
    ipAddress: string
    userAgent?: string | null
    visitedAt?: Date | string
  }

  export type PropertyVisitUncheckedCreateWithoutPropertyInput = {
    id?: string
    visitorId?: string | null
    ipAddress: string
    userAgent?: string | null
    visitedAt?: Date | string
  }

  export type PropertyVisitCreateOrConnectWithoutPropertyInput = {
    where: PropertyVisitWhereUniqueInput
    create: XOR<PropertyVisitCreateWithoutPropertyInput, PropertyVisitUncheckedCreateWithoutPropertyInput>
  }

  export type PropertyVisitCreateManyPropertyInputEnvelope = {
    data: PropertyVisitCreateManyPropertyInput | PropertyVisitCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type PropertyFavoriteCreateWithoutPropertyInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type PropertyFavoriteUncheckedCreateWithoutPropertyInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type PropertyFavoriteCreateOrConnectWithoutPropertyInput = {
    where: PropertyFavoriteWhereUniqueInput
    create: XOR<PropertyFavoriteCreateWithoutPropertyInput, PropertyFavoriteUncheckedCreateWithoutPropertyInput>
  }

  export type PropertyFavoriteCreateManyPropertyInputEnvelope = {
    data: PropertyFavoriteCreateManyPropertyInput | PropertyFavoriteCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type PriceHistoryCreateWithoutPropertyInput = {
    id?: string
    oldPrice?: Decimal | DecimalJsLike | number | string | null
    newPrice: Decimal | DecimalJsLike | number | string
    reason?: string | null
    changedAt?: Date | string
    changedBy?: string | null
  }

  export type PriceHistoryUncheckedCreateWithoutPropertyInput = {
    id?: string
    oldPrice?: Decimal | DecimalJsLike | number | string | null
    newPrice: Decimal | DecimalJsLike | number | string
    reason?: string | null
    changedAt?: Date | string
    changedBy?: string | null
  }

  export type PriceHistoryCreateOrConnectWithoutPropertyInput = {
    where: PriceHistoryWhereUniqueInput
    create: XOR<PriceHistoryCreateWithoutPropertyInput, PriceHistoryUncheckedCreateWithoutPropertyInput>
  }

  export type PriceHistoryCreateManyPropertyInputEnvelope = {
    data: PriceHistoryCreateManyPropertyInput | PriceHistoryCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type PropertyImageUpsertWithWhereUniqueWithoutPropertyInput = {
    where: PropertyImageWhereUniqueInput
    update: XOR<PropertyImageUpdateWithoutPropertyInput, PropertyImageUncheckedUpdateWithoutPropertyInput>
    create: XOR<PropertyImageCreateWithoutPropertyInput, PropertyImageUncheckedCreateWithoutPropertyInput>
  }

  export type PropertyImageUpdateWithWhereUniqueWithoutPropertyInput = {
    where: PropertyImageWhereUniqueInput
    data: XOR<PropertyImageUpdateWithoutPropertyInput, PropertyImageUncheckedUpdateWithoutPropertyInput>
  }

  export type PropertyImageUpdateManyWithWhereWithoutPropertyInput = {
    where: PropertyImageScalarWhereInput
    data: XOR<PropertyImageUpdateManyMutationInput, PropertyImageUncheckedUpdateManyWithoutPropertyInput>
  }

  export type PropertyImageScalarWhereInput = {
    AND?: PropertyImageScalarWhereInput | PropertyImageScalarWhereInput[]
    OR?: PropertyImageScalarWhereInput[]
    NOT?: PropertyImageScalarWhereInput | PropertyImageScalarWhereInput[]
    id?: StringFilter<"PropertyImage"> | string
    propertyId?: StringFilter<"PropertyImage"> | string
    url?: StringFilter<"PropertyImage"> | string
    alt?: StringNullableFilter<"PropertyImage"> | string | null
    order?: IntFilter<"PropertyImage"> | number
    createdAt?: DateTimeFilter<"PropertyImage"> | Date | string
  }

  export type PropertyVisitUpsertWithWhereUniqueWithoutPropertyInput = {
    where: PropertyVisitWhereUniqueInput
    update: XOR<PropertyVisitUpdateWithoutPropertyInput, PropertyVisitUncheckedUpdateWithoutPropertyInput>
    create: XOR<PropertyVisitCreateWithoutPropertyInput, PropertyVisitUncheckedCreateWithoutPropertyInput>
  }

  export type PropertyVisitUpdateWithWhereUniqueWithoutPropertyInput = {
    where: PropertyVisitWhereUniqueInput
    data: XOR<PropertyVisitUpdateWithoutPropertyInput, PropertyVisitUncheckedUpdateWithoutPropertyInput>
  }

  export type PropertyVisitUpdateManyWithWhereWithoutPropertyInput = {
    where: PropertyVisitScalarWhereInput
    data: XOR<PropertyVisitUpdateManyMutationInput, PropertyVisitUncheckedUpdateManyWithoutPropertyInput>
  }

  export type PropertyVisitScalarWhereInput = {
    AND?: PropertyVisitScalarWhereInput | PropertyVisitScalarWhereInput[]
    OR?: PropertyVisitScalarWhereInput[]
    NOT?: PropertyVisitScalarWhereInput | PropertyVisitScalarWhereInput[]
    id?: StringFilter<"PropertyVisit"> | string
    propertyId?: StringFilter<"PropertyVisit"> | string
    visitorId?: StringNullableFilter<"PropertyVisit"> | string | null
    ipAddress?: StringFilter<"PropertyVisit"> | string
    userAgent?: StringNullableFilter<"PropertyVisit"> | string | null
    visitedAt?: DateTimeFilter<"PropertyVisit"> | Date | string
  }

  export type PropertyFavoriteUpsertWithWhereUniqueWithoutPropertyInput = {
    where: PropertyFavoriteWhereUniqueInput
    update: XOR<PropertyFavoriteUpdateWithoutPropertyInput, PropertyFavoriteUncheckedUpdateWithoutPropertyInput>
    create: XOR<PropertyFavoriteCreateWithoutPropertyInput, PropertyFavoriteUncheckedCreateWithoutPropertyInput>
  }

  export type PropertyFavoriteUpdateWithWhereUniqueWithoutPropertyInput = {
    where: PropertyFavoriteWhereUniqueInput
    data: XOR<PropertyFavoriteUpdateWithoutPropertyInput, PropertyFavoriteUncheckedUpdateWithoutPropertyInput>
  }

  export type PropertyFavoriteUpdateManyWithWhereWithoutPropertyInput = {
    where: PropertyFavoriteScalarWhereInput
    data: XOR<PropertyFavoriteUpdateManyMutationInput, PropertyFavoriteUncheckedUpdateManyWithoutPropertyInput>
  }

  export type PropertyFavoriteScalarWhereInput = {
    AND?: PropertyFavoriteScalarWhereInput | PropertyFavoriteScalarWhereInput[]
    OR?: PropertyFavoriteScalarWhereInput[]
    NOT?: PropertyFavoriteScalarWhereInput | PropertyFavoriteScalarWhereInput[]
    id?: StringFilter<"PropertyFavorite"> | string
    propertyId?: StringFilter<"PropertyFavorite"> | string
    userId?: StringFilter<"PropertyFavorite"> | string
    createdAt?: DateTimeFilter<"PropertyFavorite"> | Date | string
  }

  export type PriceHistoryUpsertWithWhereUniqueWithoutPropertyInput = {
    where: PriceHistoryWhereUniqueInput
    update: XOR<PriceHistoryUpdateWithoutPropertyInput, PriceHistoryUncheckedUpdateWithoutPropertyInput>
    create: XOR<PriceHistoryCreateWithoutPropertyInput, PriceHistoryUncheckedCreateWithoutPropertyInput>
  }

  export type PriceHistoryUpdateWithWhereUniqueWithoutPropertyInput = {
    where: PriceHistoryWhereUniqueInput
    data: XOR<PriceHistoryUpdateWithoutPropertyInput, PriceHistoryUncheckedUpdateWithoutPropertyInput>
  }

  export type PriceHistoryUpdateManyWithWhereWithoutPropertyInput = {
    where: PriceHistoryScalarWhereInput
    data: XOR<PriceHistoryUpdateManyMutationInput, PriceHistoryUncheckedUpdateManyWithoutPropertyInput>
  }

  export type PriceHistoryScalarWhereInput = {
    AND?: PriceHistoryScalarWhereInput | PriceHistoryScalarWhereInput[]
    OR?: PriceHistoryScalarWhereInput[]
    NOT?: PriceHistoryScalarWhereInput | PriceHistoryScalarWhereInput[]
    id?: StringFilter<"PriceHistory"> | string
    propertyId?: StringFilter<"PriceHistory"> | string
    oldPrice?: DecimalNullableFilter<"PriceHistory"> | Decimal | DecimalJsLike | number | string | null
    newPrice?: DecimalFilter<"PriceHistory"> | Decimal | DecimalJsLike | number | string
    reason?: StringNullableFilter<"PriceHistory"> | string | null
    changedAt?: DateTimeFilter<"PriceHistory"> | Date | string
    changedBy?: StringNullableFilter<"PriceHistory"> | string | null
  }

  export type PropertyCreateWithoutImagesInput = {
    id?: string
    title: string
    location: string
    price: Decimal | DecimalJsLike | number | string
    status?: $Enums.PropertyStatus
    adminStatus?: $Enums.AdminStatus
    type?: $Enums.PropertyType | null
    imageUrl?: string | null
    description?: string | null
    bedrooms?: number | null
    bathrooms?: number | null
    area?: Decimal | DecimalJsLike | number | string | null
    yearBuilt?: number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: boolean | null
    pool?: boolean | null
    energyRating?: string | null
    views?: number
    features?: PropertyCreatefeaturesInput | string[]
    contactPhone?: string | null
    contactEmail?: string | null
    ownerId?: string | null
    agentId?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    visits?: PropertyVisitCreateNestedManyWithoutPropertyInput
    favorites?: PropertyFavoriteCreateNestedManyWithoutPropertyInput
    priceHistory?: PriceHistoryCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutImagesInput = {
    id?: string
    title: string
    location: string
    price: Decimal | DecimalJsLike | number | string
    status?: $Enums.PropertyStatus
    adminStatus?: $Enums.AdminStatus
    type?: $Enums.PropertyType | null
    imageUrl?: string | null
    description?: string | null
    bedrooms?: number | null
    bathrooms?: number | null
    area?: Decimal | DecimalJsLike | number | string | null
    yearBuilt?: number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: boolean | null
    pool?: boolean | null
    energyRating?: string | null
    views?: number
    features?: PropertyCreatefeaturesInput | string[]
    contactPhone?: string | null
    contactEmail?: string | null
    ownerId?: string | null
    agentId?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    visits?: PropertyVisitUncheckedCreateNestedManyWithoutPropertyInput
    favorites?: PropertyFavoriteUncheckedCreateNestedManyWithoutPropertyInput
    priceHistory?: PriceHistoryUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutImagesInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutImagesInput, PropertyUncheckedCreateWithoutImagesInput>
  }

  export type PropertyUpsertWithoutImagesInput = {
    update: XOR<PropertyUpdateWithoutImagesInput, PropertyUncheckedUpdateWithoutImagesInput>
    create: XOR<PropertyCreateWithoutImagesInput, PropertyUncheckedCreateWithoutImagesInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutImagesInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutImagesInput, PropertyUncheckedUpdateWithoutImagesInput>
  }

  export type PropertyUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusFieldUpdateOperationsInput | $Enums.AdminStatus
    type?: NullableEnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: NullableIntFieldUpdateOperationsInput | number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pool?: NullableBoolFieldUpdateOperationsInput | boolean | null
    energyRating?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    features?: PropertyUpdatefeaturesInput | string[]
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    visits?: PropertyVisitUpdateManyWithoutPropertyNestedInput
    favorites?: PropertyFavoriteUpdateManyWithoutPropertyNestedInput
    priceHistory?: PriceHistoryUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusFieldUpdateOperationsInput | $Enums.AdminStatus
    type?: NullableEnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: NullableIntFieldUpdateOperationsInput | number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pool?: NullableBoolFieldUpdateOperationsInput | boolean | null
    energyRating?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    features?: PropertyUpdatefeaturesInput | string[]
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    visits?: PropertyVisitUncheckedUpdateManyWithoutPropertyNestedInput
    favorites?: PropertyFavoriteUncheckedUpdateManyWithoutPropertyNestedInput
    priceHistory?: PriceHistoryUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyCreateWithoutPriceHistoryInput = {
    id?: string
    title: string
    location: string
    price: Decimal | DecimalJsLike | number | string
    status?: $Enums.PropertyStatus
    adminStatus?: $Enums.AdminStatus
    type?: $Enums.PropertyType | null
    imageUrl?: string | null
    description?: string | null
    bedrooms?: number | null
    bathrooms?: number | null
    area?: Decimal | DecimalJsLike | number | string | null
    yearBuilt?: number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: boolean | null
    pool?: boolean | null
    energyRating?: string | null
    views?: number
    features?: PropertyCreatefeaturesInput | string[]
    contactPhone?: string | null
    contactEmail?: string | null
    ownerId?: string | null
    agentId?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: PropertyImageCreateNestedManyWithoutPropertyInput
    visits?: PropertyVisitCreateNestedManyWithoutPropertyInput
    favorites?: PropertyFavoriteCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutPriceHistoryInput = {
    id?: string
    title: string
    location: string
    price: Decimal | DecimalJsLike | number | string
    status?: $Enums.PropertyStatus
    adminStatus?: $Enums.AdminStatus
    type?: $Enums.PropertyType | null
    imageUrl?: string | null
    description?: string | null
    bedrooms?: number | null
    bathrooms?: number | null
    area?: Decimal | DecimalJsLike | number | string | null
    yearBuilt?: number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: boolean | null
    pool?: boolean | null
    energyRating?: string | null
    views?: number
    features?: PropertyCreatefeaturesInput | string[]
    contactPhone?: string | null
    contactEmail?: string | null
    ownerId?: string | null
    agentId?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: PropertyImageUncheckedCreateNestedManyWithoutPropertyInput
    visits?: PropertyVisitUncheckedCreateNestedManyWithoutPropertyInput
    favorites?: PropertyFavoriteUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutPriceHistoryInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutPriceHistoryInput, PropertyUncheckedCreateWithoutPriceHistoryInput>
  }

  export type PropertyUpsertWithoutPriceHistoryInput = {
    update: XOR<PropertyUpdateWithoutPriceHistoryInput, PropertyUncheckedUpdateWithoutPriceHistoryInput>
    create: XOR<PropertyCreateWithoutPriceHistoryInput, PropertyUncheckedCreateWithoutPriceHistoryInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutPriceHistoryInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutPriceHistoryInput, PropertyUncheckedUpdateWithoutPriceHistoryInput>
  }

  export type PropertyUpdateWithoutPriceHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusFieldUpdateOperationsInput | $Enums.AdminStatus
    type?: NullableEnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: NullableIntFieldUpdateOperationsInput | number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pool?: NullableBoolFieldUpdateOperationsInput | boolean | null
    energyRating?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    features?: PropertyUpdatefeaturesInput | string[]
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: PropertyImageUpdateManyWithoutPropertyNestedInput
    visits?: PropertyVisitUpdateManyWithoutPropertyNestedInput
    favorites?: PropertyFavoriteUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutPriceHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusFieldUpdateOperationsInput | $Enums.AdminStatus
    type?: NullableEnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: NullableIntFieldUpdateOperationsInput | number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pool?: NullableBoolFieldUpdateOperationsInput | boolean | null
    energyRating?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    features?: PropertyUpdatefeaturesInput | string[]
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: PropertyImageUncheckedUpdateManyWithoutPropertyNestedInput
    visits?: PropertyVisitUncheckedUpdateManyWithoutPropertyNestedInput
    favorites?: PropertyFavoriteUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyCreateWithoutVisitsInput = {
    id?: string
    title: string
    location: string
    price: Decimal | DecimalJsLike | number | string
    status?: $Enums.PropertyStatus
    adminStatus?: $Enums.AdminStatus
    type?: $Enums.PropertyType | null
    imageUrl?: string | null
    description?: string | null
    bedrooms?: number | null
    bathrooms?: number | null
    area?: Decimal | DecimalJsLike | number | string | null
    yearBuilt?: number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: boolean | null
    pool?: boolean | null
    energyRating?: string | null
    views?: number
    features?: PropertyCreatefeaturesInput | string[]
    contactPhone?: string | null
    contactEmail?: string | null
    ownerId?: string | null
    agentId?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: PropertyImageCreateNestedManyWithoutPropertyInput
    favorites?: PropertyFavoriteCreateNestedManyWithoutPropertyInput
    priceHistory?: PriceHistoryCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutVisitsInput = {
    id?: string
    title: string
    location: string
    price: Decimal | DecimalJsLike | number | string
    status?: $Enums.PropertyStatus
    adminStatus?: $Enums.AdminStatus
    type?: $Enums.PropertyType | null
    imageUrl?: string | null
    description?: string | null
    bedrooms?: number | null
    bathrooms?: number | null
    area?: Decimal | DecimalJsLike | number | string | null
    yearBuilt?: number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: boolean | null
    pool?: boolean | null
    energyRating?: string | null
    views?: number
    features?: PropertyCreatefeaturesInput | string[]
    contactPhone?: string | null
    contactEmail?: string | null
    ownerId?: string | null
    agentId?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: PropertyImageUncheckedCreateNestedManyWithoutPropertyInput
    favorites?: PropertyFavoriteUncheckedCreateNestedManyWithoutPropertyInput
    priceHistory?: PriceHistoryUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutVisitsInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutVisitsInput, PropertyUncheckedCreateWithoutVisitsInput>
  }

  export type PropertyUpsertWithoutVisitsInput = {
    update: XOR<PropertyUpdateWithoutVisitsInput, PropertyUncheckedUpdateWithoutVisitsInput>
    create: XOR<PropertyCreateWithoutVisitsInput, PropertyUncheckedCreateWithoutVisitsInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutVisitsInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutVisitsInput, PropertyUncheckedUpdateWithoutVisitsInput>
  }

  export type PropertyUpdateWithoutVisitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusFieldUpdateOperationsInput | $Enums.AdminStatus
    type?: NullableEnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: NullableIntFieldUpdateOperationsInput | number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pool?: NullableBoolFieldUpdateOperationsInput | boolean | null
    energyRating?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    features?: PropertyUpdatefeaturesInput | string[]
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: PropertyImageUpdateManyWithoutPropertyNestedInput
    favorites?: PropertyFavoriteUpdateManyWithoutPropertyNestedInput
    priceHistory?: PriceHistoryUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutVisitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusFieldUpdateOperationsInput | $Enums.AdminStatus
    type?: NullableEnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: NullableIntFieldUpdateOperationsInput | number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pool?: NullableBoolFieldUpdateOperationsInput | boolean | null
    energyRating?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    features?: PropertyUpdatefeaturesInput | string[]
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: PropertyImageUncheckedUpdateManyWithoutPropertyNestedInput
    favorites?: PropertyFavoriteUncheckedUpdateManyWithoutPropertyNestedInput
    priceHistory?: PriceHistoryUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyCreateWithoutFavoritesInput = {
    id?: string
    title: string
    location: string
    price: Decimal | DecimalJsLike | number | string
    status?: $Enums.PropertyStatus
    adminStatus?: $Enums.AdminStatus
    type?: $Enums.PropertyType | null
    imageUrl?: string | null
    description?: string | null
    bedrooms?: number | null
    bathrooms?: number | null
    area?: Decimal | DecimalJsLike | number | string | null
    yearBuilt?: number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: boolean | null
    pool?: boolean | null
    energyRating?: string | null
    views?: number
    features?: PropertyCreatefeaturesInput | string[]
    contactPhone?: string | null
    contactEmail?: string | null
    ownerId?: string | null
    agentId?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: PropertyImageCreateNestedManyWithoutPropertyInput
    visits?: PropertyVisitCreateNestedManyWithoutPropertyInput
    priceHistory?: PriceHistoryCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutFavoritesInput = {
    id?: string
    title: string
    location: string
    price: Decimal | DecimalJsLike | number | string
    status?: $Enums.PropertyStatus
    adminStatus?: $Enums.AdminStatus
    type?: $Enums.PropertyType | null
    imageUrl?: string | null
    description?: string | null
    bedrooms?: number | null
    bathrooms?: number | null
    area?: Decimal | DecimalJsLike | number | string | null
    yearBuilt?: number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: boolean | null
    pool?: boolean | null
    energyRating?: string | null
    views?: number
    features?: PropertyCreatefeaturesInput | string[]
    contactPhone?: string | null
    contactEmail?: string | null
    ownerId?: string | null
    agentId?: string | null
    createdBy?: string | null
    updatedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: PropertyImageUncheckedCreateNestedManyWithoutPropertyInput
    visits?: PropertyVisitUncheckedCreateNestedManyWithoutPropertyInput
    priceHistory?: PriceHistoryUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutFavoritesInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutFavoritesInput, PropertyUncheckedCreateWithoutFavoritesInput>
  }

  export type PropertyUpsertWithoutFavoritesInput = {
    update: XOR<PropertyUpdateWithoutFavoritesInput, PropertyUncheckedUpdateWithoutFavoritesInput>
    create: XOR<PropertyCreateWithoutFavoritesInput, PropertyUncheckedCreateWithoutFavoritesInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutFavoritesInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutFavoritesInput, PropertyUncheckedUpdateWithoutFavoritesInput>
  }

  export type PropertyUpdateWithoutFavoritesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusFieldUpdateOperationsInput | $Enums.AdminStatus
    type?: NullableEnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: NullableIntFieldUpdateOperationsInput | number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pool?: NullableBoolFieldUpdateOperationsInput | boolean | null
    energyRating?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    features?: PropertyUpdatefeaturesInput | string[]
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: PropertyImageUpdateManyWithoutPropertyNestedInput
    visits?: PropertyVisitUpdateManyWithoutPropertyNestedInput
    priceHistory?: PriceHistoryUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutFavoritesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPropertyStatusFieldUpdateOperationsInput | $Enums.PropertyStatus
    adminStatus?: EnumAdminStatusFieldUpdateOperationsInput | $Enums.AdminStatus
    type?: NullableEnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    yearBuilt?: NullableIntFieldUpdateOperationsInput | number | null
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    garage?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pool?: NullableBoolFieldUpdateOperationsInput | boolean | null
    energyRating?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    features?: PropertyUpdatefeaturesInput | string[]
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: PropertyImageUncheckedUpdateManyWithoutPropertyNestedInput
    visits?: PropertyVisitUncheckedUpdateManyWithoutPropertyNestedInput
    priceHistory?: PriceHistoryUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyImageCreateManyPropertyInput = {
    id?: string
    url: string
    alt?: string | null
    order?: number
    createdAt?: Date | string
  }

  export type PropertyVisitCreateManyPropertyInput = {
    id?: string
    visitorId?: string | null
    ipAddress: string
    userAgent?: string | null
    visitedAt?: Date | string
  }

  export type PropertyFavoriteCreateManyPropertyInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type PriceHistoryCreateManyPropertyInput = {
    id?: string
    oldPrice?: Decimal | DecimalJsLike | number | string | null
    newPrice: Decimal | DecimalJsLike | number | string
    reason?: string | null
    changedAt?: Date | string
    changedBy?: string | null
  }

  export type PropertyImageUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyImageUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyImageUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyVisitUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitorId?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: StringFieldUpdateOperationsInput | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyVisitUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitorId?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: StringFieldUpdateOperationsInput | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyVisitUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitorId?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: StringFieldUpdateOperationsInput | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    visitedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyFavoriteUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyFavoriteUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyFavoriteUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceHistoryUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    oldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    newPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PriceHistoryUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    oldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    newPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PriceHistoryUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    oldPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    newPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    changedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}