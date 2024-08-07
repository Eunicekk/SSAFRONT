function solution(progresses, speeds) {
    let howLong = [];
    
    // 각 기능 별 걸리는 일 계산
    // 100퍼를 채워야하기 때문에 올림을 이용
    for(let i=0; i<progresses.length; i++) {
        howLong.push(Math.ceil((100-progresses[i])/speeds[i]))
    }
    // [7,3,9]
    // [5,10,1,1,20,1]
    
    // 결과 배열에 1을 넣고 max의 초기값으로 첫번째 값을 넣어줌
    let answer = [1];
    let max = howLong[0];
    
    // 그 다음 값부터 순회하며 현재 설정된 max보다 작거나 같으면 같이 배포하기에 그 날에 1을 더함
    // max 값이 갱신되면 다음 날에 배포하기에 결과 배열에 1을 새로 추가
    for(let i = 1; i < howLong.length; i++) {
        if(howLong[i] <= max) {
            answer[answer.length-1] ++;
        } else {
            max = howLong[i];
            answer.push(1);
        }
    }
    
    return answer;
}
