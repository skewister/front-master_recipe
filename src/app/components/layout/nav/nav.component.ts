import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements AfterViewInit {
  @ViewChildren('menuItem') menuItems!: QueryList<ElementRef>;
  @ViewChild('menuBorder') menuBorder!: ElementRef;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveState();
      this.positionBorderAtActiveItem(); // Nouvelle fonction pour positionner la bordure
    });

    // Positionnement initial de la bordure
    this.positionBorderAtActiveItem();
  }

  positionBorderAtActiveItem() {
    const activeItem = this.menuItems.find(item => this.isActive(item.nativeElement.getAttribute('routerLink')));
    if (activeItem) {
      this.updateBorderPosition(activeItem);
    }
  }


  updateActiveState() {
    let activeItemFound = false;

    this.menuItems.forEach(item => {
      const isActive = this.router.url === item.nativeElement.getAttribute('routerLink');
      item.nativeElement.classList.toggle('active', isActive);

      if (isActive) {
        this.updateBorderPosition(item);
        activeItemFound = true;
      }
    });

    // Si aucun élément actif n'est trouvé, repositionner la bordure
    if (!activeItemFound) {
      this.resetBorderPosition();
    }
  }

  updateBorderPosition(activeLink: ElementRef) {
    const border = this.menuBorder.nativeElement;
    const link = activeLink.nativeElement;

    // Calcul de la position gauche de la bordure
    const offsetActiveItem = link.getBoundingClientRect();
    const parentOffset = link.parentNode.getBoundingClientRect();
    const left = offsetActiveItem.left - parentOffset.left - (border.offsetWidth - offsetActiveItem.width) / 2;

    // Mise à jour de la position de la bordure
    border.style.transform = `translate3d(${left}px, 0, 0)`;
  }


  resetBorderPosition() {
    const border = this.menuBorder.nativeElement;
    border.style.transform = 'translate3d(0, 0, 0)';
  }

  isActive(url: string): boolean {
    const currentUrl = this.router.url.split('?')[0]; // Sépare les paramètres de requête
    return currentUrl === url || currentUrl.startsWith(url + '/');
  }
}
