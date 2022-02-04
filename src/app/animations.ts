import { trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

export const SlideInOutAnimation = [
    trigger('slideInOut', [
        state('in', style({
            'height': '500px' 
        })),
        state('out', style({
            'height': '0px' 
        })),
        transition('in => out', [group([
            animate('600ms ease-in-out', style({
                'height': '0px'
            })),
        ]
        )]),
        transition('out => in', [group([          
            animate('600ms ease-in-out', style({
                'height': '500px'
            }))
        ]
        )])
    ]),
]

export const Slidefade = [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate(2000, style({opacity: 1}))
      ]) 
    ])
  ]

  export const SlideIn = [
  trigger('listAnimation', [
    transition('* => *', [ 
    query(':enter', style({opacity:0}), {optional:true}),

      query(':enter', stagger('300ms', [
        animate('500ms ease-in',  keyframes([
          style({opacity: 0, transform: 'translateX(-75px)', offset:0}),
          style({opacity: .5, transform: 'translateX(35px)', offset:0.3}),
          style({opacity: 1, transform: 'translateX(0px)', offset:1}) 
        ]))
      ]), {optional: true}), 
      query(':leave', stagger('150ms', [
        animate('500ms ease-out',  keyframes([
          style({opacity: 1, transform: 'translateX(0px)', offset:0}),
          style({opacity: .5, transform: 'translateX(20px)', offset:0.3}),
          style({opacity: 0, transform: 'translateX(-75px)', offset:1}) 
        ]))
      ]), {optional: true}), 
      
    ])
  ])
]
