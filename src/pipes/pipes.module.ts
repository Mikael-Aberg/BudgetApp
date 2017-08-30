import { NgModule } from '@angular/core';
import { IconPipe } from './transaction/iconPipe';
import { CalculatePipe } from './calculate/calculate';
@NgModule({
    declarations: [IconPipe,
    CalculatePipe],
	imports: [],
    exports: [IconPipe,
    CalculatePipe]
})
export class PipesModule {}
