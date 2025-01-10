export  type userType={
    name:string,
    address:string,
    Games:gameType[]

}
export type gameType={
    moves:String[],
    blackId:number,
    whiteId:number,
    winnerId:number
}