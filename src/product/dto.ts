import {
    IsNotEmpty,
    IsNumber,
    IsString,
    IsEnum,
    IsDate,
    IsPositive,
    Length,
    Max,
} from 'class-validator'

export enum ProductTypeEnum {
    FOOD = 'food',
    CLOTH = 'cloth',
    ELECTRONIC = 'electronic',
}

export class ProductDto{
    @IsNotEmpty()
    purchaseId: any;

    @IsNotEmpty()
    @IsDate()
    purchaseDate: Date;

    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    name: string;
    
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;
    
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Max(10)
    quantity: number;
    
    @IsNotEmpty()
    @IsEnum(ProductTypeEnum)
    type: ProductTypeEnum;
    
    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    buyer: string;
    
    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    seller: string;
}

export class AddProductDto{
    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    name: string;
    
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;
    
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Max(10)
    quantity: number;
    
    @IsNotEmpty()
    @IsEnum(ProductTypeEnum)
    type: ProductTypeEnum;
    
    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    buyer: string;
    
    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    seller: string;
}