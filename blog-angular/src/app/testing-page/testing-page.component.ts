import { Component } from '@angular/core';
import { Router } from '@angular/router';
type BtnId = 'tl' | 'tr' | 'bl' | 'br';
@Component({
  selector: 'app-testing-page',
  templateUrl: './testing-page.component.html',
  styleUrl: './testing-page.component.css'
})
export class TestingPageComponent {
  // ποια buttons είναι αυτή τη στιγμή πατημένα
  pressedButtons = new Set<BtnId>();

  // ποιο pointer (δάχτυλο) κρατάει ποιο button
  private pointerToButton = new Map<number, BtnId>();

  // για να μη κάνει navigate συνέχεια όσο κρατάνε πατημένα
  private routed = false;

  constructor(private router: Router) {}

  onPointerDown(ev: PointerEvent, btn: BtnId) {
    ev.preventDefault();

    // ώστε να πάρουμε σίγουρα pointerup, ακόμα κι αν το δάχτυλο φύγει από το κουμπί
    (ev.currentTarget as HTMLElement).setPointerCapture?.(ev.pointerId);

    this.pointerToButton.set(ev.pointerId, btn);
    this.pressedButtons.add(btn);

    this.checkRoute();
  }

  onPointerUp(ev: PointerEvent, btn: BtnId) {
    ev.preventDefault();
    this.releasePointer(ev.pointerId, btn);
  }

  onPointerCancel(ev: PointerEvent, btn: BtnId) {
    this.releasePointer(ev.pointerId, btn);
  }

  onLostPointerCapture(ev: PointerEvent, btn: BtnId) {
    this.releasePointer(ev.pointerId, btn);
  }

  private releasePointer(pointerId: number, btn: BtnId) {
    // αφαιρούμε mapping για το συγκεκριμένο pointer
    const mappedBtn = this.pointerToButton.get(pointerId);
    if (mappedBtn) this.pointerToButton.delete(pointerId);

    // αν υπάρχει κι άλλο δάχτυλο που κρατάει το ίδιο button, μην το βγάλεις από pressed
    const stillHeld = Array.from(this.pointerToButton.values()).some(b => b === btn);
    if (!stillHeld) this.pressedButtons.delete(btn);

    // όταν αφεθούν όλα, επιτρέπουμε νέο trigger
    if (this.pressedButtons.size === 0) this.routed = false;
  }

  private checkRoute() {
    if (this.routed) return;

    if (this.pressedButtons.size >= 2) {
      this.routed = true;
      this.router.navigate(['/photo']);
    }

    // Αν θες “μόνο συγκεκριμένα combos”, πες μου και στο αλλάζω:
    // const combo = [...this.pressedButtons].sort().join('+');
    // if (combo === 'bl+tr') { ... }
  }

  // (optional) για UI feedback (π.χ. pressed style)
  isPressed(btn: BtnId) {
    return this.pressedButtons.has(btn);
  }
}
