import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { PlayersDialogComponent } from './routes/dialogs/players-dialog/players-dialog.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PlayersDialogComponent>>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);

    dialogRefSpy.afterClosed.and.returnValue(of(["Player1", "Player2"]));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    await TestBed.configureTestingModule({
      imports: [AppComponent, PlayersDialogComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy }
      ],
    }).overrideProvider(MatDialog, {useValue: dialogSpy}).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it("should open a dialog on init", () => {
    spyOn(component, "openDialog");
    component.ngOnInit();
    expect(component.openDialog).toHaveBeenCalled();
  });

  it("should open a dialog", () => {
    component.openDialog();
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
