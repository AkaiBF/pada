import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreDialogComponent } from './score-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScoreType } from '../../../core/enums/score-type.enum';

describe('ScoreDialogComponent', () => {
  let component: ScoreDialogComponent;
  let fixture: ComponentFixture<ScoreDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ScoreDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [ScoreDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { data: 1 } },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should get type bet", () => {
    component.inputData = {name: "test", type: ScoreType.BET};
    expect(component.type).toEqual("Apuesta");
  })

  it("should get type achieved", () => {
    component.inputData = {name: "test", type: ScoreType.ACHIEVED};
    expect(component.type).toEqual("Conseguidas");
  });

  it("should close", () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(component.data);
  })
});
