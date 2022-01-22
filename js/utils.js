class Utils{
    constructor(){

    
    this.consoantes = 'bcdfgjklmnpqrstvxz'
    this.vogais = 'aeiou'
    this.cLength = this.consoantes.length
    this.vLength = this.vogais.length

}

    nameGenerate(silabas = 3, capitalize = false) {
        let palavra = ''
        for (let i = 0; i < silabas; i++) {
            let c = this.consoantes.charAt(Math.round(Math.random() * this.cLength - 1))
            let v = this.vogais.charAt(Math.round(Math.random() * this.vLength - 1))
            palavra = `${palavra}${c}${v}`
        }
        if (capitalize) {
            palavra = palavra.substring(0, 1).toUpperCase() + palavra.substring(1)
        }
        return palavra
    }
}
