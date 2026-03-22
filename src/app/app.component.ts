import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

/** Tuple: [id, name, imagePath] */
type LotCard = [number, string, string];

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  //#region 'Variables'
  private loteria: LotCard[] = [
    [1, 'gallo', './assets/images/cartas/1.png'],
    [2, 'diablito', './assets/images/cartas/2.png'],
    [3, 'dama', './assets/images/cartas/3.png'],
    [4, 'catrin', './assets/images/cartas/4.png'],
    [5, 'paraguas', './assets/images/cartas/5.png'],
    [6, 'sirena', './assets/images/cartas/6.png'],
    [7, 'escalera', './assets/images/cartas/7.png'],
    [8, 'botella', './assets/images/cartas/8.png'],
    [9, 'barril', './assets/images/cartas/9.png'],
    [10, 'arbol', './assets/images/cartas/10.png'],
    [11, 'melon', './assets/images/cartas/11.png'],
    [12, 'valiente', './assets/images/cartas/12.png'],
    [13, 'gorrito', './assets/images/cartas/13.png'],
    [14, 'muerte', './assets/images/cartas/14.png'],
    [15, 'pera', './assets/images/cartas/15.png'],
    [16, 'bandera', './assets/images/cartas/16.png'],
    [17, 'bandolon', './assets/images/cartas/17.png'],
    [18, 'violoncello', './assets/images/cartas/18.png'],
    [19, 'garza', './assets/images/cartas/19.png'],
    [20, 'pajaro', './assets/images/cartas/20.png'],
    [21, 'mano', './assets/images/cartas/21.png'],
    [22, 'bota', './assets/images/cartas/22.png'],
    [23, 'luna', './assets/images/cartas/23.png'],
    [24, 'cotorro', './assets/images/cartas/24.png'],
    [25, 'borracho', './assets/images/cartas/25.png'],
    [26, 'negrito', './assets/images/cartas/26.png'],
    [27, 'corazon', './assets/images/cartas/27.png'],
    [28, 'sandia', './assets/images/cartas/28.png'],
    [29, 'tambor', './assets/images/cartas/29.png'],
    [30, 'camaron', './assets/images/cartas/30.png'],
    [31, 'jaras', './assets/images/cartas/31.png'],
    [32, 'musico', './assets/images/cartas/32.png'],
    [33, 'arania', './assets/images/cartas/33.png'],
    [34, 'soldado', './assets/images/cartas/34.png'],
    [35, 'estrella', './assets/images/cartas/35.png'],
    [36, 'cazo', './assets/images/cartas/36.png'],
    [37, 'mundo', './assets/images/cartas/37.png'],
    [38, 'apache', './assets/images/cartas/38.png'],
    [39, 'nopal', './assets/images/cartas/39.png'],
    [40, 'alacran', './assets/images/cartas/40.png'],
    [41, 'rosa', './assets/images/cartas/41.png'],
    [42, 'calavera', './assets/images/cartas/42.png'],
    [43, 'campana', './assets/images/cartas/43.png'],
    [44, 'cantarito', './assets/images/cartas/44.png'],
    [45, 'venado', './assets/images/cartas/45.png'],
    [46, 'sol', './assets/images/cartas/46.png'],
    [47, 'corona', './assets/images/cartas/47.png'],
    [48, 'chalupa', './assets/images/cartas/48.png'],
    [49, 'pino', './assets/images/cartas/49.png'],
    [50, 'pescado', './assets/images/cartas/50.png'],
    [51, 'palma', './assets/images/cartas/51.png'],
    [52, 'maceta', './assets/images/cartas/52.png'],
    [53, 'arpa', './assets/images/cartas/53.png'],
    [54, 'rana', './assets/images/cartas/54.png'],
  ];
  private doubles = ['14', '113', '116', '413', '416', '611', '710', '1316'];

  public card: LotCard[] = [];
  public cards: LotCard[][] = [];
  public cards_ordered: LotCard[][] = [];

  public name_top = '';
  public dobles = 'true';
  public cuantas = '0';
  public cantidad = '';
  public ubicacion = '666';
  public ubicacionDoblesIMG = './assets/images/orden/666.png';
  //#endregion 'Variables'

  //#region 'General Methods'
  /** Updates the preview image when the user selects a double placement option. */
  public ubicacionDobles(): void {
    this.ubicacionDoblesIMG = `./assets/images/orden/${this.ubicacion}.png`;
  }

  /** Generates N random, unique Loteria cards preventing simultaneous wins. */
  public create_cards(): void {
    this.cards = [];
    this.cards_ordered = [];
    const CANTIDAD = this.cuantas === '0' ? 54 : Number(this.cantidad);

    const usedCards = new Set<string>(); // Tracks full card signatures (16 pictures)
    const usedLines = new Set<string>(); // Tracks winning combinations of 4 pictures 

    for (let i = 1; i <= CANTIDAD; i++) {
      let attempts = 0;
      let valid = false;
      let newCard: LotCard[] = [];
      let cardSignature = '';
      let cardLines: string[] = [];

      while (!valid && attempts < 2000) {
        attempts++;
        newCard = this.generate_random_card(i);
        
        // Full card uniqueness (no 2 identical boards)
        const ids = newCard.map(c => c[0]);
        cardSignature = [...ids].sort((a,b)=>a-b).join('-');
        
        if (usedCards.has(cardSignature)) continue;

        // Prevent identical winning 4-picture line combinations so 2 players don't tie
        cardLines = this.getWinningLines(newCard);
        const hasDuplicateLine = cardLines.some(line => usedLines.has(line));
        
        if (hasDuplicateLine) continue;

        // If it passed all collision checks, break out
        valid = true;
      }

      if (!valid) {
         console.warn(`Fallback for Card #${i} after 2000 attempts. Relaxing geometric line constraints.`);
      }

      // Add verified signatures to our tracking sets
      usedCards.add(cardSignature);
      cardLines.forEach(line => usedLines.add(line));

      this.cards.push(this.cloneData(newCard));
      // Sort numerically by ID
      this.cards_ordered.push(this.cloneData(newCard).sort((a,b)=>a[0]-b[0]));
    }

    this.showData();
  }

  /** Triggers the browser print dialog. */
  public imprimir(): void {
    window.print();
  }

  /** Shuffles and builds a 16-image card, optionally inserting a double image. */
  private generate_random_card(index: number): LotCard[] {
    const deck = this.cloneData(this.loteria);
    // Fisher-Yates shuffle array
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    if (this.dobles === 'true') {
      // Pick the image to double sequentially so every card gets a different extra advantage
      const targetDoubleId = ((index - 1) % 54) + 1;
      const doubleImage = this.loteria.find(c => c[0] === targetDoubleId)!;
      
      const others = deck.filter(c => c[0] !== targetDoubleId).slice(0, 14);
      const newCard = [...others];
      
      this.applyDoubleFormat(newCard, doubleImage);
      return newCard;
    } else {
      // Strictly 16 unique images (Sin Dobles)
      return deck.slice(0, 16);
    }
  }

  /** Inserts the double card into the selected placement configuration. */
  private applyDoubleFormat(card: LotCard[], doubleImage: LotCard): void {
    let ran = this.ubicacion;
    let p1 = 1;
    let p2 = 4;

    if (ran === '666') {
      // Restore classic behavior: randomly select one of the 8 established cultural patterns
      ran = this.doubles[Math.floor(Math.random() * this.doubles.length)];
    }

    // Map exact 1-based positions from strict layouts
    switch (ran) {
      case '14':   p1 = 1;  p2 = 4;  break;
      case '113':  p1 = 1;  p2 = 13; break;
      case '116':  p1 = 1;  p2 = 16; break;
      case '413':  p1 = 4;  p2 = 13; break;
      case '416':  p1 = 4;  p2 = 16; break;
      case '611':  p1 = 6;  p2 = 11; break;
      case '710':  p1 = 7;  p2 = 10; break;
      case '1316': p1 = 13; p2 = 16; break;
    }

    // Perform the array splices securely converting strictly back to 0-based arrays
    card.splice(p1 - 1, 0, doubleImage);
    card.splice(p2 - 1, 0, doubleImage);
  }

  /** Extracts all combinations of rows, cols, diagonals, corners, and center blocks to prevent simultaneous multi-player wins. */
  private getWinningLines(card: LotCard[]): string[] {
    const lines: string[] = [];
    const ids = card.map(c => c[0]);
    
    const addLine = (indexes: number[]): void => {
      // Standardize the line signature by sorting it ascending
      const lineIds = indexes.map(i => ids[i]).sort((a,b)=>a-b);
      lines.push(lineIds.join('-'));
    };

    // 4 Rows
    addLine([0,1,2,3]); addLine([4,5,6,7]); addLine([8,9,10,11]); addLine([12,13,14,15]);
    // 4 Columns
    addLine([0,4,8,12]); addLine([1,5,9,13]); addLine([2,6,10,14]); addLine([3,7,11,15]);
    // 2 Diagonals
    addLine([0,5,10,15]); addLine([3,6,9,12]);
    // Four corners
    addLine([0,3,12,15]);
    // Center square block
    addLine([5,6,9,10]);
    
    return lines;
  }

  /** Generates a specific, pre-defined set of cards for testing. */
  public create_specific_cards(): void {
    this.name_top = 'Lidia Martinez Garcia';
    this.cards = [];
    this.cards_ordered = [];

    const personal_cards = [
      [15, 52, 33, 23, 17, 44, 8, 1, 18, 32, 44, 13, 35, 19, 9, 24],
      [25, 11, 13, 48, 41, 37, 53, 16, 7, 37, 36, 47, 49, 50, 54, 20],
      [14, 17, 20, 22, 16, 45, 52, 47, 3, 21, 45, 18, 10, 33, 38, 19],
      [12, 3, 48, 39, 10, 53, 54, 45, 13, 4, 54, 50, 33, 24, 16, 23],
      [8, 46, 7, 29, 22, 35, 23, 21, 31, 26, 35, 16, 17, 41, 47, 52],
      [31, 29, 47, 2, 6, 43, 30, 42, 25, 44, 43, 20, 21, 28, 26, 53],
      [44, 42, 7, 8, 45, 23, 35, 41, 1, 46, 23, 18, 50, 14, 9, 43],
      [27, 10, 29, 28, 31, 11, 15, 12, 26, 49, 11, 34, 17, 51, 52, 32],
    ];

    for (const element of personal_cards) {
      this.card = [];
      element.forEach((t) => {
        const lote = this.loteria.filter((obj) => obj[0] === t)[0];
        this.card.push(lote);
      });
      this.cards.push(this.cloneData(this.card));
    }
  }

  /** Logs sorted card data to the console for debugging. */
  private showData(): void {
    this.cards.forEach((el) => {
      const DATA = [
        el[0][0],
        el[1][0],
        el[2][0],
        el[3][0],
        el[4][0],
        el[5][0],
        el[6][0],
        el[7][0],
        el[8][0],
        el[9][0],
        el[10][0],
        el[11][0],
        el[12][0],
        el[13][0],
        el[14][0],
        el[15][0],
      ].sort();
      console.warn(DATA);
    });
  }

  /** Deep-clones data via JSON serialization. */
  private cloneData(data: LotCard[]): LotCard[] {
    return JSON.parse(JSON.stringify(data)) as LotCard[];
  }
  //#endregion 'General Methods'
}
