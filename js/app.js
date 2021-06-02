Vue.component('members-card', { 
    props: ['member', 'showMemberInfo'],
    template: `
    <div class="card" @mouseover="mouseover" @mousemove="mousemove" @mouseleave="mouseleave" @click="selectMember">
        <div class="content">
            <img v-bind:src="'img/' + member.card" v-bind:style="imgtranslate" />
        </div>
        <div class="title">{{member.name}} {{member.lastname}}</div>
    </div>
    `,
    data: function () {
        return {
            cardtransform: {
                translateX: 0,
                translateY: 0,
                transition: ''
            }
        }
    },
    computed: {
        imgtranslate() {
            return `transform: translate(${ this.cardtransform.translateX }px, ${ this.cardtransform.translateY }px); ${ this.cardtransform.transition }`;
        }
    },
    methods: {
        getElements: function(e) {
            let target = e.path[0];
            let contentHTML = target.children[0];

            if (!contentHTML) return null;

            let contentHorizontalOffset = (target.clientWidth - contentHTML.clientWidth) / 2;
            let contentVerticallOffset = (target.clientHeight - contentHTML.clientHeight) / 2;

            let posX = e.offsetX;
            let posY = e.offsetY;

            let contentLimitBox = {
                left: contentHorizontalOffset,
                right: target.clientWidth - contentHorizontalOffset,
            
                top: contentVerticallOffset,
                bottom: target.clientHeight - contentVerticallOffset,
            };

            let content = {
                box: contentLimitBox,
                isInside: () => {
                    return ( posX >= contentLimitBox.left && posX <= contentLimitBox.right && posY >= contentLimitBox.top && posY <= contentLimitBox.bottom );
                }
            }

            let center = {
                x: target.clientWidth / 2,
                y: target.clientHeight / 2
            };

            return {
                content,
                center,
                offset: {
                    x: center.x - posX,
                    y: center.y - posY
                }
            };

        },
        selectMember: function(e) {
            let card = this.getElements(e);
            if (!card || !card.content.isInside()) return;      

            this.$emit('selectmember', { member: this.member, card});
        },
        mousemove: function(e) {
            if (this.showMemberInfo) return;

            let card = this.getElements(e);
            if (!card || !card.content.isInside()) return;            

            let ofsx = card.offset.x / 20;
            let ofsy = card.offset.y / 30;

            this.cardtransform = {
                translateX: ofsx,
                translateY: ofsy,
                transition: ''
            } 
        },
        mouseover: function(e) {
            let self = this;

            setTimeout(() => {
                self.cardtransform = {
                    translateX: 0,
                    translateY: 0,
                    transition: ''
                } 
            }, 500);  
        },
        mouseleave: function(e){
            this.cardtransform = {
                translateX: 0,
                translateY: 0,
                transition: 'transition: all .5s'
            }   
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        showMemberInfo: false,
        memberCardRowStyle: '',
        member: {},
        members: [
            { id: 0, name: 'Julia', lastname: 'Acosta', card: 'member1-card.png', img: 'member1.png', rol: 'web developer.', description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
            { id: 1, name: 'Andrea', lastname: 'Acero', card: 'member2-card.png', img: 'member2.png', rol: 'web designer.', description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
            { id: 2, name: 'Juan', lastname: 'Amaya', card: 'member3-card.png', img: 'member3.png', rol: 'Chief Financial Officer.', description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
            { id: 3, name: 'Julian', lastname: 'Galeano', card: 'member4-card.png', img: 'member4.png', rol: 'Marketing director.', description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
            { id: 4, name: 'Leonardo', lastname: 'Sabogal', card: 'member5-card.png', img: 'member5.png', rol: 'web designer.', description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
            { id: 5, name: 'Laura', lastname: 'Ochoa', card: 'member6-card.png', img: 'member6.png', rol: 'web developer.', description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
            { id: 6, name: 'Lina', lastname: 'Mendez', card: 'member7-card.png', img: 'member7.png', rol: 'Executive Director.', description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." },
            { id: 7, name: 'Sebastian', lastname: 'Sanchez', card: 'member8-card.png', img: 'member8.png', rol: 'web developer.', description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book." }
        ],
        useArrow: true,
        showMemberInfoContent: false,
        noAnimation: false,
        membersCopy: [],
        numberPerRow: 3,
        cardWidth: 20,
    },
    methods: {
        closetab: function(e) {
            this.useArrow = true;
            this.noAnimation = false;
            this.showMemberInfoContent = false;
            this.showMemberInfo = false;

            this.members = this.membersCopy;
            this.membersCopy = [];
            this.memberCardRowStyle = '';
            this.member = {};
        },
        getNextMemberById: function(n) {
            let index = n;
            let membersCount = this.members.length;

            if (n < 0) index = membersCount + n;
            else if (n >= membersCount) index = n - membersCount;

            return this.membersCopy[index];
        },
        updateMembersCard: function(dir) {
            this.useArrow = false;
            let anchorMember = this.members[this.members.length - 1]

            let isLeft = dir < 0;

            if (isLeft) anchorMember = this.members[0]

            let id = anchorMember.id;
            let nextId = id + dir;
            
            let nextMember = this.getNextMemberById(nextId);

            console.log(nextMember);

            setTimeout(() => {
                if (isLeft) { 
                    this.members.pop();
                    this.members.unshift(nextMember);
                } else { 
                    this.members.shift(); 
                    this.members.push(nextMember);
                }

                this.memberCardRowStyle = `margin-left: -20%; transition: none;`; 

                this.useArrow = true;
            }, 500);
        },
        rightArrow: function(e) {
            if (!this.useArrow) return;

            this.memberCardRowStyle = `margin-left: -40%; transition: all .5s;`;

            this.updateMembersCard(1);
        },
        leftArrow: function(e) {
            if (!this.useArrow) return;

            this.memberCardRowStyle = `margin-left: 0%; transition: all .5s;`;

            this.updateMembersCard(-1);
        },
        select: function(e) {

            let member = e.member;
            let id = member.id;

            let boxleft = id - this.numberPerRow;
            let boxright = id + this.numberPerRow;

            let membersCount = this.members.length;

            let newMembers = [];

            if (!this.showMemberInfo) { // First Time
                this.membersCopy = this.members;

                for (let n = boxleft; n <= boxright; n++) {
                    let newMember = this.getNextMemberById(n);
                    newMembers.push(newMember);
                }

                this.members = newMembers;
                this.memberCardRowStyle = `margin-left: -20%;`;

                setTimeout(() => {
                    this.noAnimation = true;
                    this.showMemberInfoContent = true;
                }, 600);

                setTimeout(() => {
                }, 250);
            }

            this.member = member;
            this.showMemberInfo = true;
        }
    }
})