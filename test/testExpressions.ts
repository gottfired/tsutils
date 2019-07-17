interface ITest {
    n: number;
    b?: number;
    bla?: boolean;
    s: string;
    sub?: {
        c: string;
        d?: number;
        e: Date;
    };
    numberlist: Array<{
        a: number;
        b: string;
    }>;
    stringlist?: {
        a: number;
        b: string;
    }[];
}

enum TestEnum {
    HANSI = 0,
    BURLI,
    OTTO
}
