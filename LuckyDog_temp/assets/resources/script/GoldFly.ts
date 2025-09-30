const {ccclass, property} = cc._decorator;

@ccclass
export default class GoldFly extends cc.Component {
    @property(cc.Node)
    private goldParent: cc.Node = null;
    @property(cc.Node)
    private startPosNode: cc.Node = null;
    @property(cc.Node)
    private endPosNode: cc.Node = null;
    @property(cc.Node)
    private controlPoint1Node: cc.Node = null;
    @property(cc.Node)
    private controlPoint2Node: cc.Node = null;
    @property(sp.Skeleton)
    private endPosLightSkeleton: sp.Skeleton = null;
    @property(cc.Prefab)
    private goldPrefab: cc.Prefab = null;

    protected onLoad(): void {
        let flyFly = () => {
            this.fly(() => {
                this.scheduleOnce(flyFly, 1);
            });
        };
        flyFly();
    }

    public fly(onFinish?: () => void) {
        let count = 8;
        let goldList: cc.Node[] = [];
        for(let i = 1; i <= count; i++) {
            let idx = i;
            let gold = cc.instantiate(this.goldPrefab);
            goldList.push(gold);
            gold.scale = 0;
            gold.getComponent(sp.Skeleton).setAnimation(0, "animation", true);
            gold.getChildByName("particle").getComponent(cc.ParticleSystem).resetSystem();
            gold.parent = this.goldParent;
            let startPos = this.startPosNode.convertToWorldSpaceAR(cc.Vec3.ZERO);
            startPos = this.goldParent.convertToNodeSpaceAR(startPos);
            gold.position = startPos;
            let endPos = this.endPosNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
            endPos = this.goldParent.convertToNodeSpaceAR(endPos);
            let c1 = this.controlPoint1Node.convertToWorldSpaceAR(cc.Vec2.ZERO);
            c1 = this.goldParent.convertToNodeSpaceAR(c1);
            let c2 = this.controlPoint2Node.convertToWorldSpaceAR(cc.Vec2.ZERO);
            c2 = this.goldParent.convertToNodeSpaceAR(c2);
            let delay = 0.1 * idx;
            let duration = 0.9 - 0.07 * idx;
            cc.tween(gold)
            .delay(delay)
            .parallel(
                cc.tween().bezierTo(duration, c1, c2, endPos),
                cc.tween().to(duration, { scale: 1 })
            )
            .call(() => {
                if(idx == 1) {
                    this.endPosLightSkeleton.node.active = true;
                    this.endPosLightSkeleton.setAnimation(0, "animation", false);
                }
                if(idx == count) {
                    goldList.forEach(node => node.destroy());
                    onFinish && onFinish();
                }
            })
            .start();
        }
    }
}
